/**
 * =========================================================================
 * GOOGLE APPS SCRIPT WEBHOOK: TỰ ĐỘNG THU THẬP DỮ LIỆU BÀI LÀM HỌC SINH
 * Ứng dụng: Physics Detective (Thám Tử Vật Lý 10 - NCKH Sư Phạm)
 * =========================================================================
 * 
 * HƯỚNG DẪN CÀI ĐẶT NHANH (3 PHÚT):
 * 1. Mở https://sheets.new để tạo một Google Trang Tính (Google Sheets) mới.
 * 2. Đổi tên trang tính (ví dụ: "NCKH - Dữ Liệu Học Sinh Vật Lý 10").
 * 3. Trên thanh menu, chọn: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 4. Xóa hết mã cũ trong file Code.gs, rồi DÁN TOÀN BỘ MÃ NÀY VÀO.
 * 5. Bấm nút "Lưu" (biểu tượng đĩa mềm 💾 hoặc Ctrl + S).
 * 6. Bấm nút "Triển khai" (Deploy) màu xanh ở góc trên bên phải -> "Tùy chọn triển khai mới" (New deployment).
 * 7. Chọn loại triển khai: "Ứng dụng web" (Web app).
 *    - Mô tả: Nhận dữ liệu Physics Detective
 *    - Thực thi dưới dạng (Execute as): "Tôi" (Me)
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone) -> RẤT QUAN TRỌNG!
 * 8. Bấm "Triển khai" (Deploy) -> Cấp quyền truy cập nếu Google hỏi.
 * 9. Sao chép "URL ứng dụng web" (Web App URL có dạng: https://script.google.com/macros/s/AKfycb.../exec).
 * 10. Mở trang Admin của Web (nhập mã PIN 10112026), dán URL này vào ô "CSDL Google Sheets" và bấm "Lưu Cấu Hình".
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Đợi tối đa 15 giây nếu có nhiều học sinh nộp bài cùng lúc
    lock.waitLock(15000);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Hệ thống đang bận xử lý lượt nộp khác, vui lòng thử lại sau!'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      // Fallback nếu người dùng tạo Script độc lập
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
    // BẢNG 1: TỔNG QUAN HỌC SINH (Mỗi học sinh là 1 dòng tổng hợp)
    // ===================================================================
    var sheetSummary = ss.getSheetByName('TongQuan');
    if (!sheetSummary) {
      sheetSummary = ss.insertSheet('TongQuan');
      var summaryHeaders = [
        'Mã bản ghi',
        'Thời gian nộp',
        'Họ và tên',
        'Lớp',
        'Trường',
        'Điểm số (900)',
        'Số vụ án hoàn thành',
        'T1: Phân tích chứng cứ (%)',
        'T2: Nhận diện ngụy biện (%)',
        'T3: Dự đoán POE (%)',
        'T4: Bảo vệ chân lý (%)',
        'Danh sách vụ án hoàn thành'
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
    // BẢNG 2: CHI TIẾT TỪNG ĐÁP ÁN (Dùng chạy SPSS / Phân tích từng Item)
    // ===================================================================
    var sheetDetail = ss.getSheetByName('ChiTietDapAn');
    if (!sheetDetail) {
      sheetDetail = ss.insertSheet('ChiTietDapAn');
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
      var timeStr = rec.completedAt
        ? Utilities.formatDate(new Date(rec.completedAt), "GMT+7", "yyyy-MM-dd HH:mm:ss")
        : Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd HH:mm:ss");

      // 1. Thêm dòng tổng quan
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
        (rec.solvedCaseIds || []).join(', ')
      ]);

      // 2. Thêm các dòng chi tiết đáp án
      var answers = rec.studentAnswers || {};
      Object.keys(answers).forEach(function (caseId) {
        var cData = answers[caseId];
        if (!cData) return;

        // A. Phân loại: Sự thật / Ý kiến / Giả thuyết
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

        // B. POE (Dự đoán khoa học)
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

    summaryRows.forEach(function (row) {
      sheetSummary.appendRow(row);
    });
    detailRows.forEach(function (row) {
      sheetDetail.appendRow(row);
    });

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Đã lưu thành công bài làm vào Google Sheets!',
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
    message: 'Webhook đang hoạt động bình thường và sẵn sàng nhận dữ liệu bài làm của học sinh!'
  })).setMimeType(ContentService.MimeType.JSON);
}
