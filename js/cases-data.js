/* ==========================================================================
   PHYSICS DETECTIVE - Case Data & Socratic Dialogues
   6 Grand Physics Cases (Mechanics & Dynamics Grade 10 - GDPT 2018)
   Standardized Epistemic Categorization (Fact / Opinion / Hypothesis)
   ========================================================================== */

window.CASES_DATA = [
  {
    id: 'case1',
    title: 'VỤ ÁN 1: BÍ ẨN THÁP PISA & CUỘC CHIẾN RƠI TỰ DO',
    subtitle: 'Rơi tự do, Trọng lực & Chân không (Galilei và Aristotle)',
    curriculum: 'Vật lý 10 - Bài 10: Sự rơi tự do',
    badge: 'CƠ HỌC CỔ ĐIỂN',
    simModule: 'case1',
    description: 'Một tài liệu lịch sử vừa được phục dựng: Tiến sĩ Sophos công bố "định lý ngộ nhận" khẳng định vật nặng phải rơi nhanh hơn vật nhẹ vì lực hút Trái Đất P = mg lớn hơn. Cả hội đồng khoa học đang hoang mang.',
    
    // Phase 1: Classify statements (Fact / Opinion / Hypothesis)
    classifyItems: [
      {
        id: 'c1_1',
        text: 'Quả tạ chì 5kg có khối lượng lớn gấp 10 lần chiếc lông vũ 0.5kg.',
        type: 'fact',
        explanation: 'Đây là dữ liệu đo lường vật lý khách quan bằng cân điện tử, là SỰ THẬT.'
      },
      {
        id: 'c1_2',
        text: 'Vật nặng rơi nhanh hơn vì bản chất tự nhiên của nó mong muốn trở về tâm Trái Đất mau hơn.',
        type: 'opinion',
        explanation: 'Đây là quan điểm thần bí chủ quan thời tiền khoa học của Aristotle, là Ý KIẾN.'
      },
      {
        id: 'c1_3',
        text: 'Nếu loại bỏ hoàn toàn lực cản không khí (hút chân không), mọi vật sẽ rơi với cùng một gia tốc g.',
        type: 'hypothesis',
        explanation: 'Đây là GIẢ THUYẾT KHOA HỌC của Galilei có thể kiểm chứng bằng thực nghiệm.'
      }
    ],

    // Phase 2: Fallacy Hunting
    sophosStatement: 'Hàng ngàn năm nay từ thời Aristotle vĩ đại đến đời sống hàng ngày, ai cũng thấy hòn đá rơi nhanh hơn chiếc lá! Lực hút P = mg, m lớn hơn thì lực lớn hơn, rõ ràng vật nặng phải chạm đất trước! Kẻ nào dám cãi lại Aristotle?',
    sophosSegments: [
      { id: 's1', text: 'Hàng ngàn năm nay từ thời Aristotle vĩ đại đến đời sống hàng ngày, ai cũng thấy hòn đá rơi nhanh hơn chiếc lá!', isFallacy: false, hint: 'Đây là kinh nghiệm quan sát bề ngoài, chưa phải suy diễn sai lầm.' },
      { id: 's2', text: 'Lực hút P = mg, m lớn hơn thì lực lớn hơn, rõ ràng vật nặng phải chạm đất trước!', isFallacy: true, hint: 'Chính xác! Đánh đồng Lực hút (P = mg) với Tốc độ rơi, bỏ quên Quán tính cản trở (m).' },
      { id: 's3', text: 'Kẻ nào dám cãi lại Aristotle?', isFallacy: true, hint: 'Chính xác! Ngụy biện viện dẫn uy tín thẩm quyền để áp đặt chân lý.' }
    ],
    fallacyType: 'NGỤY BIỆN VIỆN DẪN THẨM QUYỀN & KHÁI QUÁT HÓA VỘI VÃ',
    fallacyExplanation: 'Tiến sĩ Sophos lấy uy tín cổ nhân áp đặt chân lý và nhầm lẫn giữa Lực hút (P = mg) với Gia tốc rơi (a = P/m = g).',

    // Phase 3: POE (Predict - Observe - Explain)
    poeQuestion: 'Nếu hút hết không khí trong ống nghiệm (chân không), quả tạ chì 5kg và lông vũ 0.5kg vật nào sẽ chạm đất trước?',
    poeOptions: [
      { id: 'opt1', text: 'Quả tạ chì 5kg vẫn chạm đất trước vì nó nặng hơn nhiều.', correct: false, explanation: 'Ngộ nhận cổ điển Aristotle: Khối lượng lớn làm trọng lực kéo P = mg lớn hơn gấp 10 lần, nhưng khối lượng quán tính (m) cản trở gia tốc cũng lớn gấp 10 lần! Vì thế gia tốc rơi a = P/m = (mg)/m = g là hằng số. Trong chân không, cả hai rơi cùng lúc.' },
      { id: 'opt2', text: 'Cả hai chạm đất cùng một thời điểm vì gia tốc rơi tự do a = g không phụ thuộc m.', correct: true, explanation: 'Dự đoán chính xác theo định luật Galilei và Định luật II Newton: Khi loại bỏ lực cản không khí (Fcản = 0), mọi vật rơi với cùng một gia tốc g = 9.8 m/s².' },
      { id: 'opt3', text: 'Chiếc lông vũ sẽ bay lơ lửng không thể rơi vì mất không khí nâng đỡ.', correct: false, explanation: 'Ngộ nhận sai lệch bản chất chân không: Chân không chỉ là triệt tiêu lực cản không khí, còn lực hút trọng trường của Trái Đất vẫn tác dụng đầy đủ, kéo lông vũ rơi nhanh bằng quả tạ.' }
    ],

    // Phase 4: Socratic AI Duel
    socraticDuel: {
      initialSophosHp: 100,
      rounds: [
        {
          sophosAttack: 'Ngươi nói a = g ư? Vậy giải thích đi: sao ngoài đời thả quả bóng và tờ giấy thì bóng luôn rơi trước? Ngươi chối bỏ hiện thực à?',
          socratesHint: {
            t1: 'Hãy quan sát: Ngoài đời có một lực vô hình nào tác dụng ngược chiều rơi?',
            t2: 'Hãy dùng thanh chọn môi trường để quan sát trong môi trường chân không, lực cản bị triệt tiêu hoàn toàn!',
            t3: 'Định luật II Newton: Fhl = P - Fcản = ma. Khi Fcản = 0, a = P/m = mg/m = g!'
          },
          responses: [
            {
              id: 'r1',
              text: 'Do lực cản không khí tác dụng lên tờ giấy có diện tích lớn lấn át trọng lượng! Trong chân không, Fcản = 0 thì a = g như nhau!',
              damage: 50,
              correct: true,
              feedback: 'Chính xác! Bằng chứng từ cổng quang điện chứng minh hai vật chạm đất cùng lúc trong chân không!'
            },
            {
              id: 'r2',
              text: 'Tại vì tờ giấy nhẹ quá nên gió thổi bay lung tung.',
              damage: 10,
              correct: false,
              feedback: 'Lập luận còn cảm tính, chưa chỉ rõ bản chất công thức động lực học Fhl = ma.'
            }
          ]
        },
        {
          sophosAttack: 'Nhưng lực hút P = mg rõ ràng khác nhau! Vật 5kg chịu lực 49N, vật 0.5kg chỉ chịu 4.9N! Lực lớn gấp 10 lần sao gia tốc lại bằng nhau được?',
          socratesHint: {
            t1: 'Lực kéo lớn hơn, nhưng "độ lười" (quán tính) của vật nặng lớn hơn hay nhỏ hơn?',
            t2: 'Khối lượng m xuất hiện ở cả hai vế: Trọng lực kéo và Quán tính cản trở gia tốc.',
            t3: 'a = F/m = (mg)/m = g. Khối lượng triệt tiêu hoàn toàn!'
          },
          responses: [
            {
              id: 'r3',
              text: 'Trọng lực lớn gấp 10 lần nhưng khối lượng quán tính (m) cũng lớn gấp 10 lần, khiến tỉ số a = P/m = g là hằng số!',
              damage: 50,
              correct: true,
              feedback: 'Đòn phản biện sắc bén! Tiến sĩ Sophos đã hoàn toàn tâm phục khẩu phục!'
            },
            {
              id: 'r4',
              text: 'Vì Trái Đất đối xử với mọi vật công bằng như nhau.',
              damage: 0,
              correct: false,
              feedback: 'Ngụy biện gán cảm xúc đạo đức cho các định luật vật lý vô tri!'
            }
          ]
        }
      ]
    },

    // Phase 5: Verdict & Multiple Endings
    verdicts: [
      {
        id: 'v_perfect',
        title: 'BẢN ÁN KHOA HỌC TOÀN DIỆN (CHÂN LÝ GALILEI)',
        result: 'perfect',
        summary: 'Bạn đã chứng minh xuất sắc: Sự chênh lệch tốc độ rơi ngoài đời là do Lực cản không khí, không phải do khối lượng. Trong chân không hoặc khi loại bỏ lực cản, mọi vật rơi tự do với cùng gia tốc g = 9.8 m/s².'
      },
      {
        id: 'v_partial',
        title: 'BẢN ÁN NỬA VỜI (THỰC NGHIỆM THIẾU CƠ SỞ ĐỊNH LƯỢNG)',
        result: 'partial',
        summary: 'Bạn nhận ra chân không hai vật rơi bằng nhau nhưng chưa giải thích được vì sao lực hút khác nhau lại cho gia tốc bằng nhau (triệt tiêu khối lượng quán tính).'
      }
    ]
  },

  {
    id: 'case2',
    title: 'VỤ ÁN 2: TAI NẠN NGÃ TƯ - XE TẢI ĐÂM XE CON',
    subtitle: 'Định luật III Newton: Tương tác lực & Gia tốc va chạm',
    curriculum: 'Vật lý 10 - Bài 16: Định luật III Newton',
    badge: 'ĐỘNG LỰC HỌC',
    simModule: 'case2',
    description: 'Một vụ va chạm giữa xe tải 5000kg và xe con 1000kg. Xe con bẹp dúm và văng xa 20m. Luật sư của xe con kiện đòi xe tải chịu tội vì cho rằng: "Xe tải nặng hơn đã tác dụng một lực đè bẹp xe con gấp 5 lần lực xe con đánh lại!"',
    
    classifyItems: [
      {
        id: 'c2_1',
        text: 'Cảm biến lực kế điện tử ghi nhận cả hai xe chịu xung lực cực đại F = 45 kN.',
        type: 'fact',
        explanation: 'Số liệu đo trực tiếp bằng cảm biến áp điện tử là SỰ THẬT.'
      },
      {
        id: 'c2_2',
        text: 'Xe con bị bẹp nặng hơn chứng tỏ nó phải nhận lực đâm mạnh hơn từ xe tải.',
        type: 'opinion',
        explanation: 'Nhầm lẫn giữa Hậu quả biến dạng với Độ lớn lực tác dụng, là Ý KIẾN NGỤY BIỆN.'
      },
      {
        id: 'c2_3',
        text: 'Trong mọi tương tác va chạm, lực xe A tác dụng lên xe B luôn bằng về độ lớn và ngược chiều với lực xe B tác dụng lên xe A.',
        type: 'hypothesis',
        explanation: 'Đây là mệnh đề Định luật III Newton cần kiểm chứng.'
      }
    ],

    sophosStatement: 'Nhìn hiện trường đi! Xe con nát bét đầu xe, còn xe tải chỉ xước sơn! Nếu hai lực bằng nhau thì sao một bên nát một bên lành? Rõ ràng xe tải tác dụng lực lớn hơn nhiều!',
    sophosSegments: [
      { id: 's1', text: 'Nhìn hiện trường đi! Xe con nát bét đầu xe, còn xe tải chỉ xước sơn!', isFallacy: false, hint: 'Đây là sự thật ghi nhận tại hiện trường va chạm.' },
      { id: 's2', text: 'Nếu hai lực bằng nhau thì sao một bên nát một bên lành?', isFallacy: false, hint: 'Đây là câu hỏi tu từ đặt vấn đề.' },
      { id: 's3', text: 'Rõ ràng xe tải tác dụng lực lớn hơn nhiều!', isFallacy: true, hint: 'Chính xác! Đánh đồng hậu quả biến dạng vỏ xe với độ lớn lực tương tác Newton (F12 = -F21).' }
    ],
    fallacyType: 'NGỤY BIỆN ĐÁNH ĐỒNG HẬU QUẢ VỚI NGUYÊN NHÂN',
    fallacyExplanation: 'Mức độ biến dạng phụ thuộc vào kết cấu cơ học và gia tốc a = F/m, không phải do lực F12 khác F21.',

    poeQuestion: 'Khi xe tải 5000kg va chạm với xe con 1000kg, lực tương tác giữa chúng quan hệ thế nào?',
    poeOptions: [
      { id: 'opt1', text: 'Lực do xe tải tác dụng lớn hơn vì khối lượng và vận tốc lớn hơn.', correct: false, explanation: 'Ngộ nhận cảm tính: Khối lượng lớn chỉ làm xe tải có quán tính lớn hơn và gia tốc biến dạng nhỏ hơn. Nhưng theo Định luật III Newton, hai lực tương tác luôn bằng nhau tuyệt đối: Ftải = Fcon.' },
      { id: 'opt2', text: 'Hai lực luôn luôn bằng nhau tuyệt đối về độ lớn: Ftải = Fcon.', correct: true, explanation: 'Dự đoán chuẩn xác theo Định luật III Newton: Trong mọi va chạm, lực tác dụng và phản lực luôn xuất hiện đồng thời, cùng độ lớn và ngược chiều (F12 = -F21).' },
      { id: 'opt3', text: 'Lực do xe con tác dụng lớn hơn vì nó phản đòn lại.', correct: false, explanation: 'Ngộ nhận phản lực: Lực phản hồi không thể tự sinh thêm độ lớn vượt quá lực tương tác. Hai lực luôn cân bằng về độ lớn tại mọi tích tắc va chạm.' }
    ],

    socraticDuel: {
      initialSophosHp: 100,
      rounds: [
        {
          sophosAttack: 'Nếu hai lực F12 = F21 bằng nhau, vậy tại sao xe con lại bị hất văng xa 20 mét còn xe tải chỉ hơi khựng lại?',
          socratesHint: {
            t1: 'Hãy liên kết Định luật III Newton với Định luật II Newton (a = F/m).',
            t2: 'Cùng một lực F = 45kN tác dụng lên m1 = 5000kg và m2 = 1000kg thì gia tốc bên nào lớn hơn?',
            t3: 'acon = F / mcon = 45000 / 1000 = 45 m/s². atải = 45000 / 5000 = 9 m/s²! Xe con văng xa vì gia tốc lớn gấp 5 lần!'
          },
          responses: [
            {
              id: 'r1',
              text: 'Lực F bằng nhau, nhưng khối lượng xe con nhỏ gấp 5 lần nên gia tốc a = F/m lớn gấp 5 lần, làm nó văng xa!',
              damage: 50,
              correct: true,
              feedback: 'Lập luận sắc bén kết hợp Định luật II và III Newton!'
            },
            {
              id: 'r2',
              text: 'Do tài xế xe con hoảng hốt đạp nhầm chân ga.',
              damage: 0,
              correct: false,
              feedback: 'Lập luận né tránh: Phân tích tai nạn cơ học phải dựa trên định luật động lực học F = ma, không thể suy đoán tâm lý chủ quan.'
            }
          ]
        },
        {
          sophosAttack: 'Thế còn việc xe con bị bẹp dúm? Ngươi giải thích thế nào nếu không phải do lực ép quá lớn?',
          socratesHint: {
            t1: 'Vỏ xe con làm bằng tôn mỏng, khung xe tải bằng thép dầm chữ I.',
            t2: 'Giới hạn bền chịu lực của vật liệu khác nhau.',
            t3: 'Cùng chịu lực F, vật có giới hạn đàn hồi thấp hơn sẽ bị biến dạng dẻo (bẹp).'
          },
          responses: [
            {
              id: 'r3',
              text: 'Cùng chịu một lực 45 kN, nhưng kết cấu tôn vỏ mỏng của xe con có giới hạn bền thấp hơn dầm thép xe tải nên bị bẹp nát!',
              damage: 50,
              correct: true,
              feedback: 'Chính xác! Phân biệt rành mạch giữa Lực tác dụng và Giới hạn bền cơ học.'
            },
            {
              id: 'r4',
              text: 'Vì lực của xe tải truyền xuyên qua xe con làm tăng áp suất nén lên gấp nhiều lần lực xe con tác dụng ngược lại.',
              damage: 0,
              correct: false,
              feedback: 'Sai lầm ngụy biện! Cặp lực F12 và F21 luôn cùng độ lớn theo Định luật III Newton; xe con bẹp do vỏ kim loại có giới hạn bền kém hơn thép dầm xe tải.'
            }
          ]
        }
      ]
    },

    verdicts: [
      {
        id: 'v_perfect',
        title: 'BẢN ÁN ĐỊNH LUẬT III NEWTON BẤT BIẾN',
        result: 'perfect',
        summary: 'Bạn đã làm sáng tỏ: Trong mọi vụ va chạm, lực tác dụng và phản lực luôn bằng nhau về độ lớn (F12 = -F21). Hậu quả văng xa và móp méo là do chênh lệch khối lượng (gia tốc a = F/m) và giới hạn bền vật liệu.'
      }
    ]
  },

  {
    id: 'case3',
    title: 'VỤ ÁN 3: SỢI DÂY QUAY TRÒN & BÍ ẨN "LỰC VĂNG LY TÂM"',
    subtitle: 'Chuyển động tròn đều, Lực hướng tâm & Quán tính khi đứt dây',
    curriculum: 'Vật lý 10 - Bài 20: Lực hướng tâm và chuyển động tròn',
    badge: 'CHUYỂN ĐỘNG TRÒN',
    simModule: 'case3',
    description: 'Một người đứng quay một sợi dây có buộc một quả cầu kim loại tròn ở đầu. Nhân chứng tranh cãi nảy lửa: Nếu đột ngột dùng kéo cắt đứt sợi dây (hoặc tuột tay), quả cầu sẽ bay theo hướng nào? Nhiều người tin chắc rằng "sẽ có một con quái vật lực ly tâm vô hình giật văng quả cầu bay thẳng ra xa tâm quay theo phương bán kính"!',
    
    classifyItems: [
      {
        id: 'c3_1',
        text: 'Chiều dài sợi dây r = 1.2 m, quả cầu nặng m = 0.5 kg quay đều với tốc độ v = 15 m/s.',
        type: 'fact',
        explanation: 'Kích thước dây đo bằng thước và tốc độ đo bằng cảm biến quang học là SỰ THẬT.'
      },
      {
        id: 'c3_2',
        text: 'Tồn tại một lực ly tâm thực sự kéo giật vật tròn văng ra xa khỏi tâm theo phương bán kính.',
        type: 'opinion',
        explanation: 'Đây là ảo giác nhận thức trong hệ quy chiếu phi quán tính quay, là Ý KIẾN NGỤY BIỆN.'
      },
      {
        id: 'c3_3',
        text: 'Lực duy nhất tác dụng lên quả cầu giữ cho nó quay tròn là lực căng dây T hướng về tâm (Lực hướng tâm Fht = m·v²/r). Khi cắt dây (T = 0), quả cầu bay theo phương tiếp tuyến theo quán tính Newton.',
        type: 'hypothesis',
        explanation: 'Đây là GIẢ THUYẾT KHOA HỌC chuẩn mực dựa trên Định luật I Newton cần kiểm chứng.'
      }
    ],

    sophosStatement: 'Ai tự tay quay sợi dây mà chẳng cảm thấy có lực giật mạnh kéo tay mình ra ngoài? Khi lấy kéo cắt đứt dây, lực ly tâm sẽ ném quả cầu bay vọt thẳng ra xa tâm quay theo phương bán kính! Đó là lý do cả thế giới gọi là lực văng ly tâm!',
    sophosSegments: [
      { id: 's1', text: 'Ai tự tay quay sợi dây mà chẳng cảm thấy có lực giật mạnh kéo tay mình ra ngoài?', isFallacy: false, hint: 'Đây là cảm giác cơ sinh học do phản lực của lực căng dây tác dụng lên tay.' },
      { id: 's2', text: 'Khi lấy kéo cắt đứt dây, lực ly tâm sẽ ném quả cầu bay vọt thẳng ra xa tâm quay theo phương bán kính!', isFallacy: true, hint: 'Chính xác! Ngộ nhận ảo giác lực ly tâm: không có lực nào đẩy văng ra xa, vật bay tiếp tuyến do quán tính.' },
      { id: 's3', text: 'Đó là lý do cả thế giới gọi là lực văng ly tâm!', isFallacy: true, hint: 'Chính xác! Ngụy biện viện dẫn số đông để che đậy bản chất vật lý.' }
    ],
    fallacyType: 'NGỤY BIỆN BỊ ĐÁNH LỪA BỞI HỆ QUY CHIẾU PHI QUÁN TÍNH',
    fallacyExplanation: 'Lực ly tâm chỉ là lực quán tính ảo xuất hiện khi người quan sát đứng trong hệ quy chiếu quay (phi quán tính). Trong hệ quy chiếu quán tính gắn với mặt đất, chỉ có duy nhất lực căng dây T kéo vật hướng về tâm. Khi cắt dây (T = 0), theo Định luật I Newton, vật bay thẳng đều theo phương TIẾP TUYẾN với quỹ đạo tại thời điểm cắt!',

    poeQuestion: 'Khi một người đang quay tròn quả cầu buộc ở đầu dây, nếu đột ngột dùng kéo CẮT ĐỨT SỢI DÂY, quả cầu sẽ chuyển động theo hướng nào?',
    poeOptions: [
      { id: 'opt1', text: 'Bay thẳng ra xa khỏi tâm theo phương nối bán kính do lực ly tâm đẩy văng.', correct: false, explanation: 'Ngộ nhận ảo giác lực ly tâm: Lực ly tâm chỉ là lực quán tính ảo trong hệ quy chiếu quay. Trong thực tế không có lực nào đẩy vật ra xa tâm; lực duy nhất giữ vật quay tròn là lực căng dây hướng tâm.' },
      { id: 'opt2', text: 'Bay thẳng đều theo phương TIẾP TUYẾN với đường tròn tại thời điểm cắt dây theo Định luật I Newton.', correct: true, explanation: 'Dự đoán chính xác theo Định luật I Newton: Tại thời điểm cắt dây, lực hướng tâm mất đi (T = 0, Fhl = 0), vật tiếp tục chuyển động thẳng đều theo hướng vận tốc tức thời (tiếp tuyến với quỹ đạo tròn).' },
      { id: 'opt3', text: 'Dừng lại ngay lập tức và rơi thẳng đứng xuống đất.', correct: false, explanation: 'Ngộ nhận quán tính: Vật đang có vận tốc tức thời v rất lớn, theo Định luật I Newton vật không thể dừng đột ngột mà phải bảo toàn hướng chuyển động tiếp tuyến.' }
    ],

    socraticDuel: {
      initialSophosHp: 100,
      rounds: [
        {
          sophosAttack: 'Ngươi bảo bay tiếp tuyến ư? Thế lực giật căng tay tôi cảm nhận khi quay tròn là lực gì nếu không phải lực ly tâm?',
          socratesHint: {
            t1: 'Định luật III Newton: Lực tác dụng và phản lực.',
            t2: 'Bàn tay kéo quả cầu vào tâm bằng lực căng dây T (Lực hướng tâm).',
            t3: 'Theo Định luật III Newton, sợi dây tác dụng ngược lại lên tay bạn một phản lực hướng ra ngoài! Đó là lực tác dụng lên TAY BẠN, KHÔNG PHẢI lực tác dụng lên quả cầu!'
          },
          responses: [
            {
              id: 'r1',
              text: 'Lực kéo tay bạn chỉ là phản lực của lực căng dây theo Định luật III Newton! Đối với quả cầu, lực duy nhất tác dụng lên nó là lực căng dây T hướng vào tâm!',
              damage: 50,
              correct: true,
              feedback: 'Đòn phản biện bậc thầy! Phân biệt chính xác giữa Lực tác dụng lên vật và Phản lực lên tay người giữ.'
            },
            {
              id: 'r2',
              text: 'Do tay bạn quay nhanh quá nên bị mỏi cơ.',
              damage: 0,
              correct: false,
              feedback: 'Ngộ nhận sinh học: Cảm giác mỏi tay là do phản lực của lực căng dây tác dụng lên tay bạn theo Định luật III Newton, không liên quan đến hướng bay của quả cầu.'
            }
          ]
        },
        {
          sophosAttack: 'Vậy khi cắt dây, tại sao quả cầu lại bay đi mà không đứng yên?',
          socratesHint: {
            t1: 'Nhớ lại Định luật I Newton về Quán tính.',
            t2: 'Trước khi cắt dây, vectơ vận tốc tức thời v của quả cầu có phương gì với đường tròn?',
            t3: 'Vectơ vận tốc v luôn có phương TIẾP TUYẾN. Khi cắt dây, T = 0, hợp lực bằng 0, vật giữ nguyên vận tốc theo phương tiếp tuyến đó!'
          },
          responses: [
            {
              id: 'r3',
              text: 'Tại mọi thời điểm quay, vận tốc v luôn tiếp tuyến với quỹ đạo. Khi cắt dây (T = 0, hợp lực = 0), theo Định luật I Newton, vật tiếp tục bay thẳng theo phương tiếp tuyến đó!',
              damage: 50,
              correct: true,
              feedback: 'Tiến sĩ Sophos sụp đổ hoàn toàn trước chân lý Quán tính và Định luật I Newton!'
            },
            {
              id: 'r4',
              text: 'Vì lực ly tâm dư thừa trong quả cầu chưa kịp tiêu tán nên tiếp tục hất quả cầu văng ra xa theo hướng bán kính.',
              damage: 0,
              correct: false,
              feedback: 'Ngụy biện lực quán tính: Lực ly tâm không phải là một lực thực chất có năng lượng tích trữ; khi cắt dây vật bay tiếp tuyến theo quán tính (Định luật I Newton).'
            }
          ]
        }
      ]
    },

    verdicts: [
      {
        id: 'v_perfect',
        title: 'BẢN ÁN BÁC BỎ ẢO GIÁC "LỰC VĂNG LY TÂM"',
        result: 'perfect',
        summary: 'Bạn đã chứng minh xuất sắc: Trong hệ quy chiếu quán tính, lực duy nhất giữ vật tròn chuyển động cong là Lực căng dây hướng tâm (Fht = m·v²/r). Khi cắt đứt dây, không có lực ly tâm nào đẩy vật ra xa; vật bay thẳng theo phương tiếp tuyến hoàn toàn do QUÁN TÍNH NEWTON.'
      }
    ]
  },

  {
    id: 'case4',
    title: 'VỤ ÁN 4: XE TRƯỢT TỪ DỐC NGHIÊNG & TRANH CÃI LỰC MA SÁT',
    subtitle: 'Mặt phẳng nghiêng, Phân tích lực & Ma sát trượt',
    curriculum: 'Vật lý 10 - Bài 14: Lực ma sát và mặt phẳng nghiêng',
    badge: 'PHÂN TÍCH LỰC',
    simModule: 'case4',
    description: 'Một chiếc xe bị trượt từ đỉnh con dốc nghiêng góc α xuống chân dốc. Đội điều tra hiện trường tranh cãi: Liệu khi con dốc càng dốc (góc α tăng), lực ma sát trượt tác dụng lên xe có thay đổi không? Nhiều người tin rằng vì xe vẫn nặng ngần ấy tấn (P = mg không đổi) nên lực ma sát trượt luôn không đổi!',
    
    classifyItems: [
      {
        id: 'c4_1',
        text: 'Khối lượng xe m = 1200 kg, hệ số ma sát trượt giữa lốp xe và mặt đường dốc là μ = 0.35, góc nghiêng dốc ban đầu α = 30°.',
        type: 'fact',
        explanation: 'Khối lượng xe, hệ số ma sát và góc dốc là các đại lượng đo đạc thực nghiệm, là SỰ THẬT.'
      },
      {
        id: 'c4_2',
        text: 'Dù con dốc nghiêng bao nhiêu độ thì lực ma sát trượt vẫn luôn bằng μ·m·g vì khối lượng và trọng lượng xe không đổi.',
        type: 'opinion',
        explanation: 'Ngộ nhận tai hại do đánh tráo Áp lực vuông góc N với Trọng lực P, là Ý KIẾN NGỤY BIỆN.'
      },
      {
        id: 'c4_3',
        text: 'Khi góc dốc α tăng lên, áp lực vuông góc N = mg·cosα giảm xuống, dẫn tới lực ma sát trượt Fms = μ·N = μ·mg·cosα giảm mạnh.',
        type: 'hypothesis',
        explanation: 'Đây là GIẢ THUYẾT KHOA HỌC dựa trên giải tích phân tích vectơ lực cần kiểm chứng.'
      }
    ],

    sophosStatement: 'Công thức ma sát ai chả biết: Fms phụ thuộc khối lượng vật đè lên! Khối lượng xe m có mất đi lạng nào đâu mà áp lực dám tụt? Dù dốc 10 độ hay 60 độ thì xe vẫn nặng 1200kg, ma sát trượt phải giữ nguyên!',
    sophosSegments: [
      { id: 's1', text: 'Công thức ma sát ai chả biết: Fms phụ thuộc khối lượng vật đè lên!', isFallacy: false, hint: 'Đây là phát biểu tiền đề chung chung.' },
      { id: 's2', text: 'Khối lượng xe m có mất đi lạng nào đâu mà áp lực dám tụt?', isFallacy: true, hint: 'Chính xác! Đánh tráo Trọng lượng P với Áp lực vuông góc N = mg·cosα.' },
      { id: 's3', text: 'Dù dốc 10 độ hay 60 độ thì xe vẫn nặng 1200kg, ma sát trượt phải giữ nguyên!', isFallacy: true, hint: 'Chính xác! Càng dốc (α tăng) thì cosα giảm, áp lực N giảm kéo theo ma sát trượt giảm mạnh.' }
    ],
    fallacyType: 'NGỤY BIỆN ĐÁNH TRÁO KHÁI NIỆM (Đánh tráo Trọng lực P với Áp lực pháp tuyến N)',
    fallacyExplanation: 'Lực ma sát trượt chỉ tỉ lệ với Áp lực pháp tuyến ép vuông góc vào mặt tiếp xúc: Fms = μ·N. Trên mặt phẳng nghiêng góc α, trọng lực P phân tích thành hai thành phần: Px = mg·sinα (kéo trượt dọc dốc) và Py = mg·cosα (ép vuông góc dốc). Do đó N = Py = mg·cosα. Khi dốc càng đứng (α tăng), cosα giảm nên áp lực N giảm, kéo theo ma sát trượt giảm mạnh!',

    poeQuestion: 'Khi tăng góc dốc α của mặt phẳng nghiêng từ 15° lên 60°, lực ma sát trượt Fms và gia tốc trượt a sẽ biến đổi như thế nào?',
    poeOptions: [
      { id: 'opt1', text: 'Lực ma sát trượt giữ nguyên không đổi vì khối lượng m và hệ số μ không đổi.', correct: false, explanation: 'Ngộ nhận đánh tráo P và N: Khối lượng m không đổi nhưng áp lực pháp tuyến vuông góc với mặt dốc là N = mg·cosα. Càng dốc (α tăng), cosα giảm => N giảm => ma sát trượt Fms = μ·N giảm mạnh.' },
      { id: 'opt2', text: 'Lực ma sát trượt Fms giảm liên tục vì áp lực N = mg·cosα giảm; gia tốc trượt a = g(sinα - μ·cosα) tăng vọt.', correct: true, explanation: 'Dự đoán chính xác: Tăng góc dốc làm giảm áp lực pháp tuyến N = mg·cosα, giảm ma sát trượt Fms, đồng thời tăng thành phần kéo trượt Px = mg·sinα, khiến gia tốc trượt a tăng mạnh.' },
      { id: 'opt3', text: 'Lực ma sát trượt tăng lên vì xe lao nhanh hơn ép mạnh hơn.', correct: false, explanation: 'Ngộ nhận về vận tốc: Lực ma sát trượt chỉ phụ thuộc vào hệ số ma sát μ và áp lực pháp tuyến N, hoàn toàn không phụ thuộc vào tốc độ xe chạy nhanh hay chậm.' }
    ],

    socraticDuel: {
      initialSophosHp: 100,
      rounds: [
        {
          sophosAttack: 'Tại sao góc nghiêng lớn thì áp lực ép vuông góc N lại giảm? Giải thích bằng công thức toán học phân tích lực xem nào!',
          socratesHint: {
            t1: 'Hãy chiếu trọng lực P lên hai trục toạ độ: trục song song dốc và trục vuông góc dốc.',
            t2: 'Thành phần ép vuông góc vào mặt dốc là Py = P · cosα = mg · cosα.',
            t3: 'Khi α tăng từ 0° lên 90°, cosα giảm từ 1 về 0. Khi dốc đứng 90° (thẳng đứng), cos90° = 0 nên N = 0 và Fms = 0!'
          },
          responses: [
            {
              id: 'r1',
              text: 'Áp lực N = mg·cosα. Khi dốc càng nghiêng thì cosα càng giảm, làm áp lực ép vào mặt đường giảm; do đó Fms = μ·mg·cosα giảm mạnh!',
              damage: 100,
              correct: true,
              feedback: 'Phân tích vectơ lực hoàn hảo! Các công thức Px = mg·sinα, N = mg·cosα và a = g(sinα - μ·cosα) hoàn toàn chính xác.'
            },
            {
              id: 'r2',
              text: 'Vì dốc nghiêng làm trọng lực P của xe giảm dần theo định luật vạn vật hấp dẫn, dẫn đến áp lực giảm.',
              damage: 0,
              correct: false,
              feedback: 'Sai lầm nghiêm trọng: Trọng lực P = mg không đổi, chỉ có thành phần vuông góc Py = mg·cosα giảm khi góc α tăng!'
            }
          ]
        }
      ]
    },

    verdicts: [
      {
        id: 'v_perfect',
        title: 'BẢN ÁN KHOA HỌC: LÀM RÕ BẢN CHẤT ÁP LỰC PHÁP TUYẾN TRÊN DỐC',
        result: 'perfect',
        summary: 'Lực ma sát trượt phụ thuộc vào Áp lực pháp tuyến N = mg·cosα chứ không bằng P = mg. Càng tăng độ dốc α, thành phần Px = mg·sinα tăng trong khi áp lực N và ma sát trượt Fms = μ·mg·cosα giảm, khiến gia tốc trượt a = g(sinα - μ·cosα) tăng vọt!'
      }
    ]
  },

  {
    id: 'case5',
    title: 'VỤ ÁN 5: THẢM HỌA VA CHẠM XE BỌC THÉP - BÍ ẨN HAO HỤT ĐỘNG NĂNG',
    subtitle: 'Định luật bảo toàn động lượng & Va chạm mềm',
    curriculum: 'Vật lý 10 - Bài 19: Các định luật bảo toàn',
    badge: 'NĂNG LƯỢNG',
    simModule: 'case5',
    description: 'Một vụ thử nghiệm va chạm giữa hai xe bọc thép: Xe 1 nặng 2000kg đâm dính chặt vào xe 2 nặng 2000kg đang đứng yên. Giám đốc dự án tức giận: "Tại sao tổng động năng sau va chạm lại mất đi một nửa? Ai đã ăn cắp năng lượng của tôi?"',
    
    classifyItems: [
      {
        id: 'c5_1',
        text: 'Trước va chạm xe 1 có động năng Wđ1 = 400 kJ; sau va chạm hai xe dính nhau có tổng động năng Wđ2 = 200 kJ.',
        type: 'fact',
        explanation: 'Số liệu đo đạc năng lượng trước và sau va chạm là SỰ THẬT.'
      },
      {
        id: 'c5_2',
        text: 'Năng lượng tự nhiên biến mất vi phạm định luật bảo toàn năng lượng.',
        type: 'opinion',
        explanation: 'Nhầm lẫn giữa Động năng (cơ học) với Toàn bộ năng lượng hệ thống, là Ý KIẾN NGỤY BIỆN.'
      },
      {
        id: 'c5_3',
        text: 'Trong va chạm mềm, động lượng luôn bảo toàn nhưng cơ năng chuyển hóa thành biến dạng và nội nhiệt.',
        type: 'hypothesis',
        explanation: 'Nguyên lý va chạm mềm trong nhiệt động học là GIẢ THUYẾT KHOA HỌC.'
      }
    ],

    sophosStatement: 'Các người học vẹt định luật bảo toàn năng lượng mà lại để mất 200 kJ động năng à? Định luật bảo toàn sai bét rồi!',
    sophosSegments: [
      { id: 's1', text: 'Các người học vẹt định luật bảo toàn năng lượng mà lại để mất 200 kJ động năng à?', isFallacy: false, hint: 'Đây là câu châm chọc về hao hụt động năng cơ học.' },
      { id: 's2', text: 'Định luật bảo toàn sai bét rồi!', isFallacy: true, hint: 'Chính xác! Ngụy biện Bù nhìn rơm: Đánh đồng bảo toàn cơ năng với bảo toàn toàn phần năng lượng.' }
    ],
    fallacyType: 'NGỤY BIỆN BÙ NHÌN RƠM (Đánh đồng bảo toàn cơ năng với bảo toàn năng lượng toàn phần)',
    fallacyExplanation: 'Định luật bảo toàn năng lượng áp dụng cho toàn phần (nhiệt + cơ), còn cơ năng không bắt buộc bảo toàn trong va chạm mềm.',

    poeQuestion: 'Khi hai xe dính chặt vào nhau sau va chạm (va chạm mềm), động lượng và động năng bảo toàn thế nào?',
    poeOptions: [
      { id: 'opt1', text: 'Cả động lượng và động năng đều được bảo toàn 100%.', correct: false, explanation: 'Ngộ nhận đánh đồng cơ năng: Chỉ va chạm đàn hồi lý tưởng mới bảo toàn động năng. Trong va chạm mềm (dính nhau), sắt thép bị bẹp dúm và nóng lên nên động năng cơ học bắt buộc bị hao hụt.' },
      { id: 'opt2', text: 'Động lượng bảo toàn, nhưng động năng bị hao hụt một phần chuyển thành nhiệt năng và công biến dạng.', correct: true, explanation: 'Dự đoán chuẩn xác theo định luật bảo toàn: Động lượng p = (m1+m2)v luôn bảo toàn, còn phần động năng hao hụt chuyển hóa thành nội nhiệt và công biến dạng dẻo của kim loại.' },
      { id: 'opt3', text: 'Cả hai đều bị tiêu tán hoàn toàn về 0.', correct: false, explanation: 'Ngộ nhận triệt tiêu: Sau cú va chạm mềm, cả hai xe vẫn tiếp tục cùng chuyển động về phía trước với vận tốc vf, do đó động lượng và một phần động năng vẫn được duy trì.' }
    ],

    socraticDuel: {
      initialSophosHp: 100,
      rounds: [
        {
          sophosAttack: 'Vậy 200 kJ động năng biến đi đâu? Hãy chỉ ra nó đang ở dạng nào!',
          socratesHint: {
            t1: 'Hãy quan sát đầu xe sau cú đâm dính: Sắt thép bị bẹp dúm và nóng lên.',
            t2: 'Sắt thép biến dạng cần tiêu tốn công cơ học để phá vỡ liên kết cấu trúc mạng tinh thể.',
            t3: '200 kJ động năng đã biến thành Nhiệt năng làm nóng vỏ giáp và Công làm biến dạng dẻo kim loại!'
          },
          responses: [
            {
              id: 'r1',
              text: '200 kJ đã chuyển hóa thành Nhiệt năng làm nóng đầu xe và Công làm biến dạng dẻo vỏ thép bọc giáp, tổng năng lượng vẫn bảo toàn tuyệt đối!',
              damage: 100,
              correct: true,
              feedback: 'Tuyệt đỉnh! Lý thuyết Nhiệt động lực học và Va chạm mềm được giải thích sáng tỏ.'
            },
            {
              id: 'r2',
              text: '200 kJ đã hoàn toàn biến mất khỏi vũ trụ vì đây là va chạm mềm không đàn hồi.',
              damage: 0,
              correct: false,
              feedback: 'Vi phạm Định luật bảo toàn năng lượng: Năng lượng không tự nhiên sinh ra hay mất đi, mà đã chuyển thành nhiệt năng và công biến dạng dẻo.'
            }
          ]
        }
      ]
    },

    verdicts: [
      {
        id: 'v_perfect',
        title: 'BẢN ÁN BẢO TOÀN TOÀN DIỆN: NĂNG LƯỢNG KHÔNG TỰ NHIÊN MẤT ĐI',
        result: 'perfect',
        summary: 'Động lượng bảo toàn p1 = (m1+m2)vf. Động năng hao hụt chuyển hóa hoàn toàn thành nội nhiệt và công biến dạng dẻo của kim loại.'
      }
    ]
  },

  {
    id: 'case6',
    title: 'VỤ ÁN 6: NGƯỜI NHẢY DÙ & BÍ MẬT VẬN TỐC TỚI HẠN',
    subtitle: 'Lực cản không khí, Định luật I Newton & Cân bằng động trong các môi trường',
    curriculum: 'Vật lý 10 - Bài 11: Lực cản của chất lưu & Định luật Newton',
    badge: 'CHẤT LƯU',
    simModule: 'case6',
    description: 'Một người nhảy dù rơi từ trên cao xuống. Đội điều tra tranh cãi: Tại sao khi lực cản không khí bằng đúng trọng lực (Fcản = P), người nhảy dù không bị khựng lại hay bay lơ lửng trên không mà vẫn tiếp tục rơi xuống đất? Liệu trên các hành tinh khác trong Hệ Mặt Trời, chiếc dù có bung được và hãm được tốc độ rơi không?',
    
    classifyItems: [
      {
        id: 'c6_1',
        text: 'Cảm biến đo lường ghi nhận sau khi bung dù, vận tốc rơi giảm dần rồi duy trì ổn định không đổi ở mức 5.5 m/s.',
        type: 'fact',
        explanation: 'Số liệu ghi nhận trực tiếp từ thiết bị đo tốc độ GPS và phong vũ biểu là SỰ THẬT.'
      },
      {
        id: 'c6_2',
        text: 'Khi lực cản không khí bằng trọng lực (Fcản = P), hai lực triệt tiêu lẫn nhau nên người nhảy dù sẽ dừng lại đứng yên lơ lửng trên không trung.',
        type: 'opinion',
        explanation: 'Nhầm lẫn nghiêm trọng giữa gia tốc bằng 0 với vận tốc bằng 0, là Ý KIẾN NGỤY BIỆN.'
      },
      {
        id: 'c6_3',
        text: 'Theo Định luật I Newton: Khi tổng hợp lực bằng 0 (Fcản = P => ΣF = 0 => a = 0), vật đang chuyển động sẽ TIẾP TỤC CHUYỂN ĐỘNG THẲNG ĐỀU với vận tốc tới hạn chứ không đứng yên.',
        type: 'hypothesis',
        explanation: 'Đây là GIẢ THUYẾT KHOA HỌC chuẩn mực của cơ học Newton cần kiểm chứng.'
      }
    ],

    sophosStatement: 'Hợp lực bằng 0 thì chuyển động phải ngừng lại chứ! Trọng lực P kéo xuống bao nhiêu thì lực cản Fcản đẩy lên bấy nhiêu, hai lực triệt tiêu bằng 0 thì người rơi phải dừng lại lơ lửng giữa trời! Tại sao người đó vẫn tiếp tục rơi cắm đầu xuống đất?',
    sophosSegments: [
      { id: 's1', text: 'Hợp lực bằng 0 thì chuyển động phải ngừng lại chứ!', isFallacy: true, hint: 'Chính xác! Đánh đồng Hợp lực bằng 0 (Gia tốc a = 0) với Trạng thái đứng yên (Vận tốc v = 0).' },
      { id: 's2', text: 'Trọng lực P kéo xuống bao nhiêu thì lực cản Fcản đẩy lên bấy nhiêu, hai lực triệt tiêu bằng 0 thì người rơi phải dừng lại lơ lửng giữa trời!', isFallacy: true, hint: 'Chính xác! Bẫy suy diễn hoang đường cho rằng cân bằng lực sẽ hãm vật đứng yên giữa không trung.' },
      { id: 's3', text: 'Tại sao người đó vẫn tiếp tục rơi cắm đầu xuống đất?', isFallacy: false, hint: 'Đây là câu hỏi thắc mắc hiện tượng.' }
    ],
    fallacyType: 'NGỤY BIỆN NHẦM LẪN GIỮA VẬN TỐC VÀ GIA TỐC',
    fallacyExplanation: 'Tiến sĩ Sophos nhầm lẫn giữa Gia tốc a = 0 (vận tốc không đổi) với Vận tốc v = 0 (đứng yên). Định luật I Newton nêu rõ: Một vật đang có chuyển động, nếu hợp lực tác dụng bằng 0 thì nó sẽ TIẾP TỤC CHUYỂN ĐỘNG THẲNG ĐỀU với vận tốc sẵn có!',

    poeQuestion: 'Khi một người nhảy dù rơi trong không khí và đạt trạng thái lực cản không khí bằng đúng trọng lực (Fcản = P), người đó sẽ chuyển động như thế nào?',
    poeOptions: [
      { id: 'opt1', text: 'Dừng lại ngay lập tức và bay lơ lửng trên không vì hai lực đã triệt tiêu lẫn nhau.', correct: false, explanation: 'Ngộ nhận nghiêm trọng giữa v = 0 và a = 0: Khi Fcản = P thì hợp lực ΣF = 0, theo Định luật I Newton gia tốc a = 0 (vận tốc không đổi). Người nhảy dù đã có sẵn tốc độ rơi nên tiếp tục rơi thẳng đều chứ không đứng yên.' },
      { id: 'opt2', text: 'Tiếp tục rơi thẳng đều với vận tốc không đổi theo Định luật I Newton.', correct: true, explanation: 'Dự đoán hoàn toàn chính xác: Khi Fcản = P thì hợp lực ΣF = 0 => gia tốc a = 0. Theo Định luật I Newton, người rơi tiếp tục rơi thẳng đều với vận tốc tới hạn.' },
      { id: 'opt3', text: 'Rơi nhanh dần đều mãi mãi với gia tốc g không có giới hạn.', correct: false, explanation: 'Ngộ nhận bỏ qua lực cản: Lực cản không khí tăng tỉ lệ thuận với bình phương vận tốc (v²). Do đó gia tốc giảm dần về 0, vận tốc bị chặn trên bởi vận tốc tới hạn.' }
    ],

    socraticDuel: {
      initialSophosHp: 100,
      rounds: [
        {
          sophosAttack: 'Fcản = P tức là tổng hợp lực ΣF = 0! Không còn lực nào kéo nữa thì lấy đâu ra năng lượng mà rơi tiếp? Phải đứng yên chứ!',
          socratesHint: {
            t1: 'Đọc kỹ Định luật I Newton: "Một vật đang chuyển động mà không chịu lực nào hoặc chịu các lực có hợp lực bằng 0..."',
            t2: 'Gia tốc a = Δv / Δt = 0 có nghĩa là gì? Có nghĩa là vận tốc v KHÔNG THAY ĐỔI, chứ không phải v = 0!',
            t3: 'Trước khi hai lực cân bằng, người nhảy dù đã có một vận tốc rơi rất lớn. Khi hai lực cân bằng, người tiếp tục rơi đều với vận tốc đó!'
          },
          responses: [
            {
              id: 'r1',
              text: 'Theo Định luật I Newton: ΣF = 0 dẫn đến gia tốc a = 0, tức là VẬN TỐC KHÔNG THAY ĐỔI! Người nhảy dù đã có sẵn vận tốc rơi nên sẽ tiếp tục rơi thẳng đều với vận tốc tới hạn đó!',
              damage: 100,
              correct: true,
              feedback: 'Tuyệt vời! Bạn đã vạch trần dứt điểm sự nhầm lẫn giữa Gia tốc a = 0 và Vận tốc v = 0.'
            },
            {
              id: 'r2',
              text: 'Khi ΣF = 0 thì người nhảy dù lơ lửng dừng lại trên không trung một lúc rồi mới rơi tiếp do lực hút Trái Đất thắng thế.',
              damage: 0,
              correct: false,
              feedback: 'Nhầm lẫn giữa hợp lực bằng 0 (gia tốc a = 0) và đứng yên (v = 0). Người nhảy dù vẫn đang chuyển động với vận tốc tới hạn theo quán tính!'
            }
          ]
        }
      ]
    },

    verdicts: [
      {
        id: 'v_perfect',
        title: 'BẢN ÁN VẬN TỐC TỚI HẠN & ĐỊNH LUẬT I NEWTON',
        result: 'perfect',
        summary: 'Bạn đã làm sáng tỏ chân lý: Lực cản không khí Fcản tăng theo bình phương vận tốc (v²). Khi Fcản = P, hợp lực ΣF = 0, gia tốc a = 0. Người nhảy dù không hề dừng lại lơ lửng mà tiếp tục rơi thẳng đều với Vận tốc tới hạn. Khi bung dù, diện tích cản A tăng vọt giúp hạ vận tốc tới hạn xuống mức an toàn (~5 m/s).'
      }
    ]
  }
];
