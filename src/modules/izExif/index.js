/* eslint-disable */
let debug = true;

function getImageData(img) {
  return new Promise(function(resolve, reject) {
    function handleBinaryFile(binFile) {
      let data = findEXIFinJPEG(binFile);
      let iptcdata = findIPTCinJPEG(binFile);
      resolve({
        'exif': data || {},
        'iptc': iptcdata || {}
      });
    }
    if (/^data\:/i.test(img)) { // Data URI
      let arrayBuffer = base64ToArrayBuffer(img);
      handleBinaryFile(arrayBuffer);
    } else if (/^blob\:/i.test(img)) { // Object URL
      let fileReader = new FileReader();
      fileReader.onload = function(e) {
        handleBinaryFile(e.target.result);
      };
      objectURLToBlob(img, function(blob) {
        fileReader.readAsArrayBuffer(blob);
      });
    } else {
      if (typeof window === 'object' && 'document' in window) {
        let http = new XMLHttpRequest();
        http.onload = function() {
          if (this.status == 200 || this.status === 0) {
            handleBinaryFile(http.response);
          } else {
            throw 'Could not load image';
          }
          http = null;
        };
        http.open('GET', img, true);
        http.responseType = 'arraybuffer';
        http.send(null);
        return;
      }
      if (typeof plus === 'object') {
        plus.io.resolveLocalFileSystemURL(getLocalFilePath(img), function(entry) {
          entry.file(function(file) {
            let fileReader = new plus.io.FileReader();
            fileReader.onload = function(data) {
              let arrayBuffer = base64ToArrayBuffer(data.target.result);
              handleBinaryFile(arrayBuffer);
            };
            fileReader.onerror = function(error) {
              reject(error);
            };
            fileReader.readAsDataURL(file);
          }, function(error) {
            reject(error);
          });
        }, function(error) {
          reject(error);
        });
        return;
      }
      if (typeof wx === 'object' && wx.canIUse('getFileSystemManager')) {
        wx.getFileSystemManager().readFile({
          'filePath': img,
          'success': function(res) {
            console.log(res);
            handleBinaryFile(res.data);
          },
          'fail': function(error) {
            reject(error);
          }
        });
        return;
      }
      reject(new Error('not support'));
    }
  });
}

function ToDigital(strDu, strFen, strMiao, len) {
  len = len > 6 || typeof len === 'undefined' ? 6 : len;//精确到小数点后最多六位
  strDu = typeof strDu === 'undefined' || strDu == '' ? 0 : parseFloat(strDu);
  strFen = typeof strFen === 'undefined' || strFen == '' ? 0 : parseFloat(strFen) / 60;
  strMiao = typeof strMiao === 'undefined' || strMiao == '' ? 0 : parseFloat(strMiao) / 3600;
  let digital = strDu + strFen + strMiao;
  if (digital == 0) {
    return '';
  }
  return digital.toFixed(len);

}

function getFloatLocationByExif(exif){
  if(!exif.GPSLatitude||!exif.GPSLongitude){
    return null;
  }
  let lat = (exif.GPSLatitudeRef == 'S'?-1:1)*ToDigital(exif.GPSLatitude[0],exif.GPSLatitude[1],exif.GPSLatitude[2]);
  let lon = (exif.GPSLongitudeRef == 'W'?-1:1)*ToDigital(exif.GPSLongitude[0],exif.GPSLongitude[1],exif.GPSLongitude[2]);

  return {'lat':lat,'lon':lon};
}

function getLocalFilePath(path) {
  if (path.indexOf('_www') === 0 || path.indexOf('_doc') === 0 || path.indexOf('_documents') === 0 || path.indexOf(
    '_downloads') === 0) {
    return path;
  }
  if (path.indexOf('file://') === 0) {
    return path;
  }
  if (path.indexOf('/storage/emulated/0/') === 0) {
    return path;
  }
  if (path.indexOf('/') === 0) {
    let localFilePath = plus.io.convertAbsoluteFileSystem(path);
    if (localFilePath !== path) {
      return localFilePath;
    }
    path = path.substr(1);

  }
  return '_www/' + path;
}

function objectURLToBlob(url, callback) {
  let http = new XMLHttpRequest();
  http.open('GET', url, true);
  http.responseType = 'blob';
  http.onload = function(e) {
    if (this.status == 200 || this.status === 0) {
      callback(this.response);
    }
  };
  http.send();
}


function base64ToArrayBuffer(base64, contentType) {
  contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
  base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
  let binary = atob(base64);
  let len = binary.length;
  let buffer = new ArrayBuffer(len);
  let view = new Uint8Array(buffer);
  for (let i = 0; i < len; i++) {
    view[i] = binary.charCodeAt(i);
  }
  return buffer;
}

function findEXIFinJPEG(file) {
  let dataView = new DataView(file);

  if (debug) { console.log('Got file of length ' + file.byteLength); }
  if (dataView.getUint8(0) != 0xFF || dataView.getUint8(1) != 0xD8) {
    if (debug) { console.log('Not a valid JPEG'); }
    return false; // not a valid jpeg
  }

  let offset = 2,
    length = file.byteLength,
    marker;

  while (offset < length) {
    if (dataView.getUint8(offset) != 0xFF) {
      if (debug) { console.log('Not a valid marker at offset ' + offset + ', found: ' + dataView.getUint8(offset)); }
      return false; // not a valid marker, something is wrong
    }

    marker = dataView.getUint8(offset + 1);
    if (debug) { console.log(marker); }

    // we could implement handling for other markers here,
    // but we're only looking for 0xFFE1 for EXIF data

    if (marker == 225) {
      if (debug) { console.log('Found 0xFFE1 marker'); }

      return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

      // offset += 2 + file.getShortAt(offset+2, true);

    }
    offset += 2 + dataView.getUint16(offset + 2);


  }

}

function getStringFromDB(buffer, start, length) {
  let outstr = '';
  for (let n = start; n < start + length; n++) {
    outstr += String.fromCharCode(buffer.getUint8(n));
  }
  return outstr;
}

function readEXIFData(file, start) {
  if (getStringFromDB(file, start, 4) != 'Exif') {
    if (debug) { console.log('Not valid EXIF data! ' + getStringFromDB(file, start, 4)); }
    return false;
  }

  let bigEnd,
    tags, tag,
    exifData, gpsData,
    tiffOffset = start + 6;

  // test for TIFF validity and endianness
  if (file.getUint16(tiffOffset) == 0x4949) {
    bigEnd = false;
  } else if (file.getUint16(tiffOffset) == 0x4D4D) {
    bigEnd = true;
  } else {
    if (debug) { console.log('Not valid TIFF data! (no 0x4949 or 0x4D4D)'); }
    return false;
  }

  if (file.getUint16(tiffOffset + 2, !bigEnd) != 0x002A) {
    if (debug) { console.log('Not valid TIFF data! (no 0x002A)'); }
    return false;
  }

  let firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);

  if (firstIFDOffset < 0x00000008) {
    if (debug) { console.log('Not valid TIFF data! (First offset less than 8)', file.getUint32(tiffOffset + 4, !bigEnd)); }
    return false;
  }

  tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

  if (tags.ExifIFDPointer) {
    exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
    for (tag in exifData) {
      switch (tag) {
        case 'LightSource':
        case 'Flash':
        case 'MeteringMode':
        case 'ExposureProgram':
        case 'SensingMethod':
        case 'SceneCaptureType':
        case 'SceneType':
        case 'CustomRendered':
        case 'WhiteBalance':
        case 'GainControl':
        case 'Contrast':
        case 'Saturation':
        case 'Sharpness':
        case 'SubjectDistanceRange':
        case 'FileSource':
          exifData[tag] = StringValues[tag][exifData[tag]];
          break;

        case 'ExifVersion':
        case 'FlashpixVersion':
          exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
          break;

        case 'ComponentsConfiguration':
          exifData[tag] =
                        StringValues.Components[exifData[tag][0]] +
                        StringValues.Components[exifData[tag][1]] +
                        StringValues.Components[exifData[tag][2]] +
                        StringValues.Components[exifData[tag][3]];
          break;
      }
      tags[tag] = exifData[tag];
    }
  }

  if (tags.GPSInfoIFDPointer) {
    gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
    for (tag in gpsData) {
      switch (tag) {
        case 'GPSVersionID':
          gpsData[tag] = gpsData[tag][0] +
                        '.' + gpsData[tag][1] +
                        '.' + gpsData[tag][2] +
                        '.' + gpsData[tag][3];
          break;
      }
      tags[tag] = gpsData[tag];
    }
  }

  // extract thumbnail
  tags['thumbnail'] = readThumbnailImage(file, tiffOffset, firstIFDOffset, bigEnd);

  return tags;
}

function readTags(file, tiffStart, dirStart, strings, bigEnd) {
  let entries = file.getUint16(dirStart, !bigEnd),
    tags = {},
    entryOffset, tag,
    i;

  for (i = 0; i < entries; i++) {
    entryOffset = dirStart + i * 12 + 2;
    tag = strings[file.getUint16(entryOffset, !bigEnd)];
    if (!tag && debug) { console.log('Unknown tag: ' + file.getUint16(entryOffset, !bigEnd)); }
    tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
  }
  return tags;
}

var TiffTags = {
  '256': 'ImageWidth',
  '257': 'ImageHeight',
  '34665': 'ExifIFDPointer',
  '34853': 'GPSInfoIFDPointer',
  '40965': 'InteroperabilityIFDPointer',
  '258': 'BitsPerSample',
  '259': 'Compression',
  '262': 'PhotometricInterpretation',
  '274': 'Orientation',
  '277': 'SamplesPerPixel',
  '284': 'PlanarConfiguration',
  '530': 'YCbCrSubSampling',
  '531': 'YCbCrPositioning',
  '282': 'XResolution',
  '283': 'YResolution',
  '296': 'ResolutionUnit',
  '273': 'StripOffsets',
  '278': 'RowsPerStrip',
  '279': 'StripByteCounts',
  '513': 'JPEGInterchangeFormat',
  '514': 'JPEGInterchangeFormatLength',
  '301': 'TransferFunction',
  '318': 'WhitePoint',
  '319': 'PrimaryChromaticities',
  '529': 'YCbCrCoefficients',
  '532': 'ReferenceBlackWhite',
  '306': 'DateTime',
  '270': 'ImageDescription',
  '271': 'Make',
  '272': 'Model',
  '305': 'Software',
  '315': 'Artist',
  '33432': 'Copyright'
};

var GPSTags = {
  '0': 'GPSVersionID',
  '1': 'GPSLatitudeRef',
  '2': 'GPSLatitude',
  '3': 'GPSLongitudeRef',
  '4': 'GPSLongitude',
  '5': 'GPSAltitudeRef',
  '6': 'GPSAltitude',
  '7': 'GPSTimeStamp',
  '8': 'GPSSatellites',
  '9': 'GPSStatus',
  '10': 'GPSMeasureMode',
  '11': 'GPSDOP',
  '12': 'GPSSpeedRef',
  '13': 'GPSSpeed',
  '14': 'GPSTrackRef',
  '15': 'GPSTrack',
  '16': 'GPSImgDirectionRef',
  '17': 'GPSImgDirection',
  '18': 'GPSMapDatum',
  '19': 'GPSDestLatitudeRef',
  '20': 'GPSDestLatitude',
  '21': 'GPSDestLongitudeRef',
  '22': 'GPSDestLongitude',
  '23': 'GPSDestBearingRef',
  '24': 'GPSDestBearing',
  '25': 'GPSDestDistanceRef',
  '26': 'GPSDestDistance',
  '27': 'GPSProcessingMethod',
  '28': 'GPSAreaInformation',
  '29': 'GPSDateStamp',
  '30': 'GPSDifferential'
};

// EXIF 2.3 Spec
let IFD1Tags = {
  '256': 'ImageWidth',
  '257': 'ImageHeight',
  '258': 'BitsPerSample',
  '259': 'Compression',
  '262': 'PhotometricInterpretation',
  '273': 'StripOffsets',
  '274': 'Orientation',
  '277': 'SamplesPerPixel',
  '278': 'RowsPerStrip',
  '279': 'StripByteCounts',
  '282': 'XResolution',
  '283': 'YResolution',
  '284': 'PlanarConfiguration',
  '296': 'ResolutionUnit',
  '513': 'JpegIFOffset', // When image format is JPEG, this value show offset to JPEG data stored.(aka "ThumbnailOffset" or "JPEGInterchangeFormat")
  '514': 'JpegIFByteCount', // When image format is JPEG, this value shows data size of JPEG image (aka "ThumbnailLength" or "JPEGInterchangeFormatLength")
  '529': 'YCbCrCoefficients',
  '530': 'YCbCrSubSampling',
  '531': 'YCbCrPositioning',
  '532': 'ReferenceBlackWhite'
};

var StringValues = {
  'ExposureProgram': {
    '0': 'Not defined',
    '1': 'Manual',
    '2': 'Normal program',
    '3': 'Aperture priority',
    '4': 'Shutter priority',
    '5': 'Creative program',
    '6': 'Action program',
    '7': 'Portrait mode',
    '8': 'Landscape mode'
  },
  'MeteringMode': {
    '0': 'Unknown',
    '1': 'Average',
    '2': 'CenterWeightedAverage',
    '3': 'Spot',
    '4': 'MultiSpot',
    '5': 'Pattern',
    '6': 'Partial',
    '255': 'Other'
  },
  'LightSource': {
    '0': 'Unknown',
    '1': 'Daylight',
    '2': 'Fluorescent',
    '3': 'Tungsten (incandescent light)',
    '4': 'Flash',
    '9': 'Fine weather',
    '10': 'Cloudy weather',
    '11': 'Shade',
    '12': 'Daylight fluorescent (D 5700 - 7100K)',
    '13': 'Day white fluorescent (N 4600 - 5400K)',
    '14': 'Cool white fluorescent (W 3900 - 4500K)',
    '15': 'White fluorescent (WW 3200 - 3700K)',
    '17': 'Standard light A',
    '18': 'Standard light B',
    '19': 'Standard light C',
    '20': 'D55',
    '21': 'D65',
    '22': 'D75',
    '23': 'D50',
    '24': 'ISO studio tungsten',
    '255': 'Other'
  },
  'Flash': {
    '0': 'Flash did not fire',
    '1': 'Flash fired',
    '5': 'Strobe return light not detected',
    '7': 'Strobe return light detected',
    '9': 'Flash fired, compulsory flash mode',
    '13': 'Flash fired, compulsory flash mode, return light not detected',
    '15': 'Flash fired, compulsory flash mode, return light detected',
    '16': 'Flash did not fire, compulsory flash mode',
    '24': 'Flash did not fire, auto mode',
    '25': 'Flash fired, auto mode',
    '29': 'Flash fired, auto mode, return light not detected',
    '31': 'Flash fired, auto mode, return light detected',
    '32': 'No flash function',
    '65': 'Flash fired, red-eye reduction mode',
    '69': 'Flash fired, red-eye reduction mode, return light not detected',
    '71': 'Flash fired, red-eye reduction mode, return light detected',
    '73': 'Flash fired, compulsory flash mode, red-eye reduction mode',
    '77': 'Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected',
    '79': 'Flash fired, compulsory flash mode, red-eye reduction mode, return light detected',
    '89': 'Flash fired, auto mode, red-eye reduction mode',
    '93': 'Flash fired, auto mode, return light not detected, red-eye reduction mode',
    '95': 'Flash fired, auto mode, return light detected, red-eye reduction mode'
  },
  'SensingMethod': {
    '1': 'Not defined',
    '2': 'One-chip color area sensor',
    '3': 'Two-chip color area sensor',
    '4': 'Three-chip color area sensor',
    '5': 'Color sequential area sensor',
    '7': 'Trilinear sensor',
    '8': 'Color sequential linear sensor'
  },
  'SceneCaptureType': {
    '0': 'Standard',
    '1': 'Landscape',
    '2': 'Portrait',
    '3': 'Night scene'
  },
  'SceneType': {
    '1': 'Directly photographed'
  },
  'CustomRendered': {
    '0': 'Normal process',
    '1': 'Custom process'
  },
  'WhiteBalance': {
    '0': 'Auto white balance',
    '1': 'Manual white balance'
  },
  'GainControl': {
    '0': 'None',
    '1': 'Low gain up',
    '2': 'High gain up',
    '3': 'Low gain down',
    '4': 'High gain down'
  },
  'Contrast': {
    '0': 'Normal',
    '1': 'Soft',
    '2': 'Hard'
  },
  'Saturation': {
    '0': 'Normal',
    '1': 'Low saturation',
    '2': 'High saturation'
  },
  'Sharpness': {
    '0': 'Normal',
    '1': 'Soft',
    '2': 'Hard'
  },
  'SubjectDistanceRange': {
    '0': 'Unknown',
    '1': 'Macro',
    '2': 'Close view',
    '3': 'Distant view'
  },
  'FileSource': {
    '3': 'DSC'
  },

  'Components': {
    '0': '',
    '1': 'Y',
    '2': 'Cb',
    '3': 'Cr',
    '4': 'R',
    '5': 'G',
    '6': 'B'
  }
};

var ExifTags = {
  // version tags
  '36864': 'ExifVersion', // EXIF version
  '40960': 'FlashpixVersion', // Flashpix format version

  // colorspace tags
  '40961': 'ColorSpace', // Color space information tag

  // image configuration
  '40962': 'PixelXDimension', // Valid width of meaningful image
  '40963': 'PixelYDimension', // Valid height of meaningful image
  '37121': 'ComponentsConfiguration', // Information about channels
  '37122': 'CompressedBitsPerPixel', // Compressed bits per pixel

  // user information
  '37500': 'MakerNote', // Any desired information written by the manufacturer
  '37510': 'UserComment', // Comments by user

  // related file
  '40964': 'RelatedSoundFile', // Name of related sound file

  // date and time
  '36867': 'DateTimeOriginal', // Date and time when the original image was generated
  '36868': 'DateTimeDigitized', // Date and time when the image was stored digitally
  '37520': 'SubsecTime', // Fractions of seconds for DateTime
  '37521': 'SubsecTimeOriginal', // Fractions of seconds for DateTimeOriginal
  '37522': 'SubsecTimeDigitized', // Fractions of seconds for DateTimeDigitized

  // picture-taking conditions
  '33434': 'ExposureTime', // Exposure time (in seconds)
  '33437': 'FNumber', // F number
  '34850': 'ExposureProgram', // Exposure program
  '34852': 'SpectralSensitivity', // Spectral sensitivity
  '34855': 'ISOSpeedRatings', // ISO speed rating
  '34856': 'OECF', // Optoelectric conversion factor
  '37377': 'ShutterSpeedValue', // Shutter speed
  '37378': 'ApertureValue', // Lens aperture
  '37379': 'BrightnessValue', // Value of brightness
  '37380': 'ExposureBias', // Exposure bias
  '37381': 'MaxApertureValue', // Smallest F number of lens
  '37382': 'SubjectDistance', // Distance to subject in meters
  '37383': 'MeteringMode', // Metering mode
  '37384': 'LightSource', // Kind of light source
  '37385': 'Flash', // Flash status
  '37396': 'SubjectArea', // Location and area of main subject
  '37386': 'FocalLength', // Focal length of the lens in mm
  '41483': 'FlashEnergy', // Strobe energy in BCPS
  '41484': 'SpatialFrequencyResponse', //
  '41486': 'FocalPlaneXResolution', // Number of pixels in width direction per FocalPlaneResolutionUnit
  '41487': 'FocalPlaneYResolution', // Number of pixels in height direction per FocalPlaneResolutionUnit
  '41488': 'FocalPlaneResolutionUnit', // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
  '41492': 'SubjectLocation', // Location of subject in image
  '41493': 'ExposureIndex', // Exposure index selected on camera
  '41495': 'SensingMethod', // Image sensor type
  '41728': 'FileSource', // Image source (3 == DSC)
  '41729': 'SceneType', // Scene type (1 == directly photographed)
  '41730': 'CFAPattern', // Color filter array geometric pattern
  '41985': 'CustomRendered', // Special processing
  '41986': 'ExposureMode', // Exposure mode
  '41987': 'WhiteBalance', // 1 = auto white balance, 2 = manual
  '41988': 'DigitalZoomRation', // Digital zoom ratio
  '41989': 'FocalLengthIn35mmFilm', // Equivalent foacl length assuming 35mm film camera (in mm)
  '41990': 'SceneCaptureType', // Type of scene
  '41991': 'GainControl', // Degree of overall image gain adjustment
  '41992': 'Contrast', // Direction of contrast processing applied by camera
  '41993': 'Saturation', // Direction of saturation processing applied by camera
  '41994': 'Sharpness', // Direction of sharpness processing applied by camera
  '41995': 'DeviceSettingDescription', //
  '41996': 'SubjectDistanceRange', // Distance to subject

  // other tags
  '40965': 'InteroperabilityIFDPointer',
  '42016': 'ImageUniqueID' // Identifier assigned uniquely to each image
};

function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
  let type = file.getUint16(entryOffset + 2, !bigEnd),
    numValues = file.getUint32(entryOffset + 4, !bigEnd),
    valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart,
    offset,
    vals, val, n,
    numerator, denominator;

  switch (type) {
    case 1: // byte, 8-bit unsigned int
    case 7: // undefined, 8-bit byte, value depending on field
      if (numValues == 1) {
        return file.getUint8(entryOffset + 8, !bigEnd);
      }
      offset = numValues > 4 ? valueOffset : entryOffset + 8;
      vals = [];
      for (n = 0; n < numValues; n++) {
        vals[n] = file.getUint8(offset + n);
      }
      return vals;


    case 2: // ascii, 8-bit byte
      offset = numValues > 4 ? valueOffset : entryOffset + 8;
      return getStringFromDB(file, offset, numValues - 1);

    case 3: // short, 16 bit int
      if (numValues == 1) {
        return file.getUint16(entryOffset + 8, !bigEnd);
      }
      offset = numValues > 2 ? valueOffset : entryOffset + 8;
      vals = [];
      for (n = 0; n < numValues; n++) {
        vals[n] = file.getUint16(offset + 2 * n, !bigEnd);
      }
      return vals;


    case 4: // long, 32 bit int
      if (numValues == 1) {
        return file.getUint32(entryOffset + 8, !bigEnd);
      }
      vals = [];
      for (n = 0; n < numValues; n++) {
        vals[n] = file.getUint32(valueOffset + 4 * n, !bigEnd);
      }
      return vals;


    case 5: // rational = two long values, first is numerator, second is denominator
      if (numValues == 1) {
        numerator = file.getUint32(valueOffset, !bigEnd);
        denominator = file.getUint32(valueOffset + 4, !bigEnd);
        val = new Number(numerator / denominator);
        val.numerator = numerator;
        val.denominator = denominator;
        return val;
      }
      vals = [];
      for (n = 0; n < numValues; n++) {
        numerator = file.getUint32(valueOffset + 8 * n, !bigEnd);
        denominator = file.getUint32(valueOffset + 4 + 8 * n, !bigEnd);
        vals[n] = new Number(numerator / denominator);
        vals[n].numerator = numerator;
        vals[n].denominator = denominator;
      }
      return vals;


    case 9: // slong, 32 bit signed int
      if (numValues == 1) {
        return file.getInt32(entryOffset + 8, !bigEnd);
      }
      vals = [];
      for (n = 0; n < numValues; n++) {
        vals[n] = file.getInt32(valueOffset + 4 * n, !bigEnd);
      }
      return vals;


    case 10: // signed rational, two slongs, first is numerator, second is denominator
      if (numValues == 1) {
        return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset + 4, !bigEnd);
      }
      vals = [];
      for (n = 0; n < numValues; n++) {
        vals[n] = file.getInt32(valueOffset + 8 * n, !bigEnd) / file.getInt32(valueOffset + 4 + 8 * n, !bigEnd);
      }
      return vals;

  }
}

function readThumbnailImage(dataView, tiffStart, firstIFDOffset, bigEnd) {
  // get the IFD1 offset
  let IFD1OffsetPointer = getNextIFDOffset(dataView, tiffStart + firstIFDOffset, bigEnd);

  if (!IFD1OffsetPointer) {
    // console.log('******** IFD1Offset is empty, image thumb not found ********');
    return {};
  } else if (IFD1OffsetPointer > dataView.byteLength) { // this should not happen
    // console.log('******** IFD1Offset is outside the bounds of the DataView ********');
    return {};
  }
  // console.log('*******  thumbnail IFD offset (IFD1) is: %s', IFD1OffsetPointer);

  let thumbTags = readTags(dataView, tiffStart, tiffStart + IFD1OffsetPointer, IFD1Tags, bigEnd);

  // EXIF 2.3 specification for JPEG format thumbnail

  // If the value of Compression(0x0103) Tag in IFD1 is '6', thumbnail image format is JPEG.
  // Most of Exif image uses JPEG format for thumbnail. In that case, you can get offset of thumbnail
  // by JpegIFOffset(0x0201) Tag in IFD1, size of thumbnail by JpegIFByteCount(0x0202) Tag.
  // Data format is ordinary JPEG format, starts from 0xFFD8 and ends by 0xFFD9. It seems that
  // JPEG format and 160x120pixels of size are recommended thumbnail format for Exif2.1 or later.

  if (thumbTags['Compression']) {
    // console.log('Thumbnail image found!');

    switch (thumbTags['Compression']) {
      case 6:
        // console.log('Thumbnail image format is JPEG');
        if (thumbTags.JpegIFOffset && thumbTags.JpegIFByteCount) {
          // extract the thumbnail
          let tOffset = tiffStart + thumbTags.JpegIFOffset;
          let tLength = thumbTags.JpegIFByteCount;
          //iz
          // thumbTags['blob'] = new Blob([new Uint8Array(dataView.buffer, tOffset, tLength)], {
          //     type: 'image/jpeg'
          // });
        }
        break;

      case 1:
        console.log('Thumbnail image format is TIFF, which is not implemented.');
        break;
      default:
        console.log('Unknown thumbnail image format \'%s\'', thumbTags['Compression']);
    }
  } else if (thumbTags['PhotometricInterpretation'] == 2) {
    console.log('Thumbnail image format is RGB, which is not implemented.');
  }
  return thumbTags;
}

function getNextIFDOffset(dataView, dirStart, bigEnd) {
  //the first 2bytes means the number of directory entries contains in this IFD
  let entries = dataView.getUint16(dirStart, !bigEnd);

  // After last directory entry, there is a 4bytes of data,
  // it means an offset to next IFD.
  // If its value is '0x00000000', it means this is the last IFD and there is no linked IFD.

  return dataView.getUint32(dirStart + 2 + entries * 12, !bigEnd); // each entry is 12 bytes long
}

function findIPTCinJPEG(file) {
  let dataView = new DataView(file);

  if (debug) { console.log('Got file of length ' + file.byteLength); }
  if (dataView.getUint8(0) != 0xFF || dataView.getUint8(1) != 0xD8) {
    if (debug) { console.log('Not a valid JPEG'); }
    return false; // not a valid jpeg
  }

  let offset = 2,
    length = file.byteLength;


  let isFieldSegmentStart = function(dataView, offset) {
    return (
      dataView.getUint8(offset) === 0x38 &&
            dataView.getUint8(offset + 1) === 0x42 &&
            dataView.getUint8(offset + 2) === 0x49 &&
            dataView.getUint8(offset + 3) === 0x4D &&
            dataView.getUint8(offset + 4) === 0x04 &&
            dataView.getUint8(offset + 5) === 0x04
    );
  };

  while (offset < length) {

    if (isFieldSegmentStart(dataView, offset)) {

      // Get the length of the name header (which is padded to an even number of bytes)
      let nameHeaderLength = dataView.getUint8(offset + 7);
      if (nameHeaderLength % 2 !== 0) { nameHeaderLength += 1; }
      // Check for pre photoshop 6 format
      if (nameHeaderLength === 0) {
        // Always 4
        nameHeaderLength = 4;
      }

      let startOffset = offset + 8 + nameHeaderLength;
      let sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

      return readIPTCData(file, startOffset, sectionLength);

      break;

    }
    // Not the marker, continue searching
    offset++;

  }

}
function fileToBase64(file, callback) {
  // 创建FileReader对象（不兼容IE）
  let reader = new FileReader();
  // 将file转为base64 （异步操作）
  reader.readAsDataURL(file);
  // 转换成功
  reader.onload = () => {
    const response = {
      status: true,
      data: reader.result,
    };
    callback(response);
  };
  // 转换失败
  reader.onerror = function () {
    const response = {
      status: false,
      data: reader.error,
    };
    callback(response);
  };
}

export default {
  getImageData,
  getFloatLocationByExif
};
