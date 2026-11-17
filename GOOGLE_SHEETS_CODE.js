/**
 * =========================================================================
 * GOOGLE APPS SCRIPT WEBHOOK: TỰ ĐỘNG LƯU ĐÁP ÁN BÀI LÀM HỌC SINH
 * Ứng dụng: Physics Detective (Thám Tử Vật Lý 10 - NCKH Sư Phạm)
 * =========================================================================
 * 
 * BẢNG 1: "KetQuaHocSinh" - Bảng điểm đầy đủ, mỗi học sinh 1 dòng:
 *         Hiển thị rõ ràng họ tên, lớp, trường, tổng điểm, 4 chỉ số Facione (T1-T4)
 *         và CHI TIẾT ĐÁP ÁN TỪNG VỤ ÁN (Vụ án 1 đến 6: phân loại, POE, Socrates).
 * 
 * BẢNG 2: "ChiTiet_SPSS" - Từng dòng câu hỏi để giáo viên xuất dữ liệu chạy SPSS.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Hệ thống bận, vui lòng thử lại sau!'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      ss = SpreadsheetApp.create('NCKH - Du Lieu Hoc Sinh Vat Ly 10');
    }

    var raw = '';
    if (e && e.postData && e.postData.contents) {
      raw = e.postData.contents;
    } else if (e && e.parameter && e.parameter.data) {
      raw = e.parameter.data;
    }
    if (!raw) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Không nhận được dữ liệu tải lên'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var postData = JSON.parse(raw);
    var records = Array.isArray(postData) ? postData : [postData];

    // ===================================================================
    // BẢNG 1: BẢNG ĐIỂM CHI TIẾT HỌC SINH (Dễ đọc, trực quan cho Giáo viên)
    // ===================================================================
    var sheetSummary = ss.getSheetByName('KetQuaHocSinh');
    if (!sheetSummary) {
      sheetSummary = ss.insertSheet('KetQuaHocSinh', 0);
      var summaryHeaders = [
        'Mã bản ghi',
        'Thời gian nộp',
        'Họ và tên',
        'Lớp',
        'Trường',
        'Tổng điểm (900)',
        'Số vụ hoàn thành',
        'T1: Phân tích chứng cứ (%)',
        'T2: Nhận diện ngụy biện (%)',
        'T3: Dự đoán POE (%)',
        'T4: Bảo vệ chân lý (%)',
        'Vụ 1: Rơi tự do & Chân không',
        'Vụ 2: Va chạm & Newton III',
        'Vụ 3: Quay tròn & Quán tính',
        'Vụ 4: Dốc nghiêng & Ma sát',
        'Vụ 5: Va chạm mềm & Cơ năng',
        'Vụ 6: Nhảy dù & Lực cản'
      ];
      sheetSummary.appendRow(summaryHeaders);
      sheetSummary.getRange(1, 1, 1, summaryHeaders.length)
        .setBackground('#1e293b')
        .setFontColor('#ffffff')
        .setFontWeight('bold')
        .setHorizontalAlignment('center');
      sheetSummary.setFrozenRows(1);
    }

    // ===================================================================
    // BẢNG 2: CHI TIẾT TỪNG ITEM (Dùng chạy phần mềm SPSS / Thống kê sâu)
    // ===================================================================
    var sheetDetail = ss.getSheetByName('ChiTiet_SPSS');
    if (!sheetDetail) {
      sheetDetail = ss.insertSheet('ChiTiet_SPSS');
      var detailHeaders = [
        'Mã bản ghi',
        'Thời gian',
        'Họ tên',
        'Lớp',
        'Trường',
        'Vụ án',
        'Phần thi',
        'Mã câu/phát biểu',
        'Nội dung phát biểu / câu hỏi',
        'Học sinh chọn',
        'Đáp án chuẩn',
        'Kết quả',
        'Độ tự tin / Điểm số'
      ];
      sheetDetail.appendRow(detailHeaders);
      sheetDetail.getRange(1, 1, 1, detailHeaders.length)
        .setBackground('#0f766e')
        .setFontColor('#ffffff')
        .setFontWeight('bold')
        .setHorizontalAlignment('center');
      sheetDetail.setFrozenRows(1);
    }

    var summaryRows = [];
    var detailRows = [];

    records.forEach(function (rec) {
      var p = rec.studentProfile || {};
      var f = rec.facione || {};
      var answers = rec.studentAnswers || {};
      var timeStr = rec.completedAt
        ? Utilities.formatDate(new Date(rec.completedAt), "GMT+7", "yyyy-MM-dd HH:mm:ss")
        : Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd HH:mm:ss");

      // Hàm format chi tiết đáp án từng vụ án thành văn bản rõ ràng
      function formatCaseAnswers(caseId, caseName) {
        var cData = answers[caseId];
        if (!cData) return 'Chưa tham gia vụ này';

        var lines = [];
        // 1. Phân loại
        var clsCorrect = 0, clsTotal = 0;
        var clsList = [];
        Object.keys(cData).forEach(function (k) {
          if (k === 'poeAnswer' || k === 'duelRounds') return;
          var item = cData[k];
          if (item && item.chosen) {
            clsTotal++;
            if (item.isCorrect) clsCorrect++;
            var vnType = item.chosen === 'fact' ? 'Sự thật' : (item.chosen === 'opinion' ? 'Ý kiến' : 'Giả thuyết');
            clsList.push(k + ': ' + vnType + ' (' + (item.isCorrect ? '✅ ĐÚNG' : '❌ SAI') + ')');
          }
        });
        if (clsTotal > 0) {
          lines.push('【Phân loại ' + clsCorrect + '/' + clsTotal + ' đúng】: ' + clsList.join(' | '));
        }

        // 2. Dự đoán POE
        if (cData.poeAnswer) {
          var poe = cData.poeAnswer;
          var poeStatus = poe.isCorrect ? '✅ ĐÚNG' : '❌ SAI';
          lines.push('【POE ' + poeStatus + '】: Chọn: "' + (poe.chosenText || poe.chosenOptionId) + '" (Tự tin: ' + (poe.confidence || 0) + '%)');
        }

        // 3. Tranh biện Socrates
        if (cData.duelRounds) {
          var duelList = [];
          Object.keys(cData.duelRounds).forEach(function (rk) {
            var round = cData.duelRounds[rk];
            if (round) {
              duelList.push('Vòng ' + (parseInt(rk) + 1) + ': ' + (round.isCorrect ? '✅ Đúng' : '❌ Sai') + ' (+' + (round.damage || 0) + 'đ)');
            }
          });
          if (duelList.length > 0) {
            lines.push('【Socrates】: ' + duelList.join(' | '));
          }
        }

        return lines.length > 0 ? lines.join('\n') : 'Đã mở nhưng chưa trả lời';
      }

      // 1. Dòng tổng hợp cho Bảng KetQuaHocSinh
      summaryRows.push([
        rec.id || ('rec_' + Date.now()),
        timeStr,
        p.name || 'Ẩn danh',
        p.className || '-',
        p.schoolName || '-',
        rec.score || 0,
        (rec.solvedCasesCount || 0) + ' / 6',
        f.t1 || 0,
        f.t2 || 0,
        f.t3 || 0,
        f.t4 || 0,
        formatCaseAnswers('case1', 'Rơi tự do'),
        formatCaseAnswers('case2', 'Newton III'),
        formatCaseAnswers('case3', 'Quay tròn'),
        formatCaseAnswers('case4', 'Mặt dốc'),
        formatCaseAnswers('case5', 'Va chạm mềm'),
        formatCaseAnswers('case6', 'Nhảy dù')
      ]);

      // 2. Các dòng chi tiết cho Bảng ChiTiet_SPSS
      Object.keys(answers).forEach(function (caseId) {
        var cData = answers[caseId];
        if (!cData) return;

        // A. Phân loại
        Object.keys(cData).forEach(function (k) {
          if (k === 'poeAnswer' || k === 'duelRounds') return;
          var item = cData[k];
          if (item && item.chosen) {
            detailRows.push([
              rec.id || '',
              timeStr,
              p.name || '',
              p.className || '',
              p.schoolName || '',
              caseId,
              'Phân loại (Fact/Opinion/Hypothesis)',
              k,
              item.text || '',
              item.chosen,
              item.target || '',
              item.isCorrect ? 'ĐÚNG' : 'SAI',
              ''
            ]);
          }
        });

        // B. POE
        if (cData.poeAnswer) {
          var poe = cData.poeAnswer;
          detailRows.push([
            rec.id || '',
            timeStr,
            p.name || '',
            p.className || '',
            p.schoolName || '',
            caseId,
            'Dự đoán POE',
            poe.chosenOptionId || 'POE',
            poe.chosenText || '',
            poe.chosenOptionId || '',
            poe.isCorrect ? 'ĐÚNG' : 'SAI',
            poe.isCorrect ? 'ĐÚNG' : 'SAI',
            poe.confidence ? (poe.confidence + '% - ' + (poe.confidenceLabel || '')) : ''
          ]);
        }

        // C. Tranh biện Socrates
        if (cData.duelRounds) {
          Object.keys(cData.duelRounds).forEach(function (roundKey) {
            var round = cData.duelRounds[roundKey];
            if (round) {
              detailRows.push([
                rec.id || '',
                timeStr,
                p.name || '',
                p.className || '',
                p.schoolName || '',
                caseId,
                'Tranh biện Socrates (Vòng ' + (parseInt(roundKey) + 1) + ')',
                round.responseId || '',
                round.responseText || '',
                round.responseId || '',
                round.isCorrect ? 'ĐÚNG' : 'SAI',
                round.isCorrect ? 'ĐÚNG' : 'SAI',
                (round.damage || 0) + ' điểm'
              ]);
            }
          });
        }
      });
    });

    // Thêm các dòng vào Google Sheets
    summaryRows.forEach(function (row) {
      sheetSummary.appendRow(row);
    });
    detailRows.forEach(function (row) {
      sheetDetail.appendRow(row);
    });

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Đã lưu thành công kết quả và đáp án vào Google Sheets!',
      count: summaryRows.length
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'active',
    name: 'Physics Detective - Google Sheets Webhook',
    message: 'Webhook đang hoạt động bình thường và sẵn sàng nhận đáp án học sinh!'
  })).setMimeType(ContentService.MimeType.JSON);
}
