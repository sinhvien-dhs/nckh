/* ==========================================================================
   PHYSICS DETECTIVE - Case Data & Socratic Dialogues
   6 Grand Physics Cases (Mechanics & Dynamics Grade 10 - GDPT 2018)
   ========================================================================== */

window.CASES_DATA = [
  {
    id: 'case1',
    title: 'VỤ ÁN 1: BÍ ẨN THÁP PISA & CUỘC CHIẾN RƠI TỰ DO',
    subtitle: 'Rơi tự do, Trọng lực & Chân không (Galilei vs Aristotle)',
    curriculum: 'Vật lý 10 - Bài 10: Sự rơi tự do',
    badge: 'CƠ HỌC CỔ ĐIỂN',
    simModule: 'case1',
    description: 'Một tài liệu lịch sử vừa được phục dựng: Dr. Sophos công bố "định lý ngộ nhận" khẳng định vật nặng phải rơi nhanh hơn vật nhẹ vì lực hút Trái Đất P = mg lớn hơn. Cả hội đồng khoa học đang hoang mang.',
    
    // Phase 1: Classify statements (Fact / Opinion / Hypothesis)
    classifyItems: [
      {
        id: 'c1_1',
        text: 'Quả tạ chì 5kg có khối lượng lớn gấp 10 lần chiếc lông vũ 0.5kg.',
        type: 'fact',
        explanation: 'Đây là dữ liệu đo lường vật lý khách quan bằng cân điện tử, là SỰ THẬT (Fact).'
      },
      {
        id: 'c1_2',
        text: 'Vật nặng rơi nhanh hơn vì bản chất tự nhiên của nó mong muốn trở về tâm Trái Đất mau hơn.',
        type: 'opinion',
        explanation: 'Đây là quan điểm thần bí chủ quan thời tiền khoa học của Aristotle, là Ý KIẾN (Opinion).'
      },
      {
        id: 'c1_3',
        text: 'Nếu loại bỏ hoàn toàn lực cản không khí (hút chân không), mọi vật sẽ rơi với cùng một gia tốc g.',
        type: 'hypothesis',
        explanation: 'Đây là GIẢ THUYẾT KHOA HỌC (Hypothesis) của Galilei có thể kiểm chứng bằng thực nghiệm.'
      }
    ],

    // Phase 2: Fallacy Hunting
    sophosStatement: 'Hàng ngàn năm nay từ thời Aristotle vĩ đại đến đời sống hàng ngày, ai cũng thấy hòn đá rơi nhanh hơn chiếc lá! Lực hút P = mg, m lớn hơn thì lực lớn hơn, rõ ràng vật nặng phải chạm đất trước! Kẻ nào dám cãi lại Aristotle?',
    fallacyType: 'NGỤY BIỆN THẨM QUYỀN (Appeal to Authority) & KHÁI QUÁT HÓA VỘI VÃ (Hasty Generalization)',
    fallacyExplanation: 'Dr. Sophos lấy uy tín cổ nhân áp đặt chân lý và nhầm lẫn giữa Lực hút (P = mg) với Gia tốc rơi (a = P/m = g).',

    // Phase 3: POE (Predict - Observe - Explain)
    poeQuestion: 'Nếu hút hết không khí trong ống nghiệm (chân không), quả tạ chì 5kg và lông vũ 0.5kg vật nào sẽ chạm đất trước?',
    poeOptions: [
      { id: 'opt1', text: 'Quả tạ chì 5kg vẫn chạm đất trước vì nó nặng hơn nhiều.' },
      { id: 'opt2', text: 'Cả hai chạm đất cùng một thời điểm vì gia tốc rơi tự do a = g không phụ thuộc m.', correct: true },
      { id: 'opt3', text: 'Chiếc lông vũ sẽ bay lơ lửng không thể rơi vì mất không khí nâng đỡ.' }
    ],

    // Phase 4: Socratic AI Duel
    socraticDuel: {
      initialSophosHp: 100,
      rounds: [
        {
          sophosAttack: 'Ngươi nói a = g ư? Vậy giải thích đi: sao ngoài đời thả quả bóng và tờ giấy thì bóng luôn rơi trước? Ngươi chối bỏ hiện thực à?',
          socratesHint: {
            t1: 'Hãy quan sát: Ngoài đời có một lực vô hình nào tác dụng ngược chiều rơi?',
            t2: 'Hãy dùng nút "Hút chân không" trên phòng thí nghiệm ảo để cô lập biến số lực cản không khí!',
            t3: 'Định luật II Newton: F_net = P - F_cản = ma. Khi F_cản = 0, a = P/m = mg/m = g!'
          },
          responses: [
            {
              id: 'r1',
              text: 'Do lực cản không khí tác dụng lên tờ giấy có diện tích lớn lấn át trọng lượng! Trong chân không, F_cản = 0 thì a = g như nhau!',
              damage: 50,
              correct: true,
              feedback: 'Chính xác! Bằng chứng từ cổng quang điện chứng minh t1 = t2 = 3.03s trong chân không!'
            },
            {
              id: 'r2',
              text: 'Tại vì tờ giấy nhẹ quá nên gió thổi bay.',
              damage: 10,
              correct: false,
              feedback: 'Lập luận còn cảm tính, chưa chỉ rõ bản chất công thức F_net = ma.'
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
              feedback: 'Đòn phản biện sấm sét! Dr. Sophos đã hoàn toàn tâm phục khẩu phục!'
            },
            {
              id: 'r4',
              text: 'Vì Trái Đất thương hai vật như nhau nên cho rơi đều.',
              damage: 0,
              correct: false,
              feedback: 'Ngụy biện gán cảm xúc cho vật thể vô tri!'
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
        summary: 'Bạn đã chứng minh xuất sắc: Sự chênh lệch tốc độ rơi ngoài đời là do Lực cản không khí, không phải do trọng lượng. Trong chân không, mọi vật rơi tự do với cùng gia tốc g = 9.8 m/s².'
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
        explanation: 'Số liệu đo trực tiếp bằng cảm biến áp điện tử là SỰ THẬT (Fact).'
      },
      {
        id: 'c2_2',
        text: 'Xe con bị bẹp nặng hơn chứng tỏ nó phải nhận lực đâm mạnh hơn từ xe tải.',
        type: 'opinion',
        explanation: 'Nhầm lẫn giữa Hậu quả biến dạng với Độ lớn lực tác dụng, là Ý KIẾN ngụy biện (Opinion).'
      },
      {
        id: 'c2_3',
        text: 'Trong mọi tương tác va chạm, lực xe A tác dụng lên xe B luôn bằng về độ lớn và ngược chiều với lực xe B tác dụng lên xe A.',
        type: 'hypothesis',
        explanation: 'Đây là mệnh đề Định luật III Newton cần kiểm chứng.'
      }
    ],

    sophosStatement: 'Nhìn hiện trường đi! Xe con nát bét đầu xe, còn xe tải chỉ xước sơn! Nếu hai lực bằng nhau thì sao một bên nát một bên lành? Rõ ràng xe tải tác dụng lực lớn hơn nhiều!',
    fallacyType: 'NGỤY BIỆN ĐÁNH ĐỒNG HẬU QUẢ VỚI NGUYÊN NHÂN (Confusion of Effect and Force)',
    fallacyExplanation: 'Mức độ biến dạng phụ thuộc vào kết cấu cơ học và gia tốc a = F/m, không phải do lực F12 khác F21.',

    poeQuestion: 'Khi xe tải 5000kg va chạm với xe con 1000kg, lực tương tác giữa chúng quan hệ thế nào?',
    poeOptions: [
      { id: 'opt1', text: 'Lực do xe tải tác dụng lớn hơn vì khối lượng và vận tốc lớn hơn.' },
      { id: 'opt2', text: 'Hai lực luôn luôn bằng nhau tuyệt đối về độ lớn: F_tải = F_con.', correct: true },
      { id: 'opt3', text: 'Lực do xe con tác dụng lớn hơn vì nó phản đòn lại.' }
    ],

    socraticDuel: {
      initialSophosHp: 100,
      rounds: [
        {
          sophosAttack: 'Nếu hai lực F12 = F21 bằng nhau, vậy tại sao xe con lại bị hất văng xa 20 mét còn xe tải chỉ hơi khựng lại?',
          socratesHint: {
            t1: 'Hãy liên kết Định luật III Newton với Định luật II Newton (a = F/m).',
            t2: 'Cùng một lực F = 45kN tác dụng lên m1 = 5000kg và m2 = 1000kg thì gia tốc bên nào lớn hơn?',
            t3: 'a_con = F / m_con = 45000 / 1000 = 45 m/s². a_tải = 45000 / 5000 = 9 m/s²! Xe con văng xa vì gia tốc lớn gấp 5 lần!'
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
              feedback: 'Suy đoán vô căn cứ, không có giá trị vật lý.'
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
              text: 'Mức độ biến dạng phụ thuộc vào kết cấu và độ cứng vật liệu của xe, không vi phạm định luật F12 = -F21!',
              damage: 50,
              correct: true,
              feedback: 'Tuyệt vời! Dr. Sophos đã bị thanh tẩy hoàn toàn.'
            }
          ]
        }
      ]
    },

    verdicts: [
      {
        id: 'v_perfect',
        title: 'PHÁN QUYẾT TÒA ÁN KHOA HỌC: ĐỊNH LUẬT III NEWTON BẤT BIẾN',
        result: 'perfect',
        summary: 'Hai xe tác dụng lên nhau hai lực trực đối bằng nhau về độ lớn F = 45 kN. Xe con biến dạng và văng xa do kết cấu vật liệu và gia tốc lớn gấp 5 lần (a = F/m).'
      }
    ]
  },

  {
    id: 'case3',
    title: 'VỤ ÁN 3: KHÚC CUA TỬ THẦN - BÍ ẨN "LỰC VĂNG LY TÂM"',
    subtitle: 'Chuyển động tròn đều, Lực hướng tâm & Quán tính',
    curriculum: 'Vật lý 10 - Bài 20: Lực hướng tâm và lực quán tính',
    badge: 'CHUYỂN ĐỘNG TRÒN',
    simModule: 'case3',
    description: 'Một chiếc xe đua bị trượt khỏi khúc cua tròn và lao xuống vực. Nhân chứng khẳng định: "Có một con quái vật lực ly tâm vô hình đã thò tay kéo giật xe bay thẳng xuyên tâm ra ngoài!"',
    
    classifyItems: [
      {
        id: 'c3_1',
        text: 'Bán kính khúc cua là R = 60m, xe chạy với tốc độ 15 m/s.',
        type: 'fact',
        explanation: 'Thông số hình học và đồng hồ tốc độ là SỰ THẬT.'
      },
      {
        id: 'c3_2',
        text: 'Tồn tại một lực ly tâm thực sự kéo vật bay ngược chiều tâm quay.',
        type: 'opinion',
        explanation: 'Ngộ nhận kinh điển do cảm giác trong hệ quy chiếu phi quán tính.'
      },
      {
        id: 'c3_3',
        text: 'Lực duy nhất giữ xe trên quỹ đạo cong là lực ma sát nghỉ đóng vai trò Lực hướng tâm.',
        type: 'hypothesis',
        explanation: 'Giả thuyết bản chất lực thực tế trong hệ quy chiếu quán tính.'
      }
    ],

    sophosStatement: 'Ai ngồi xe ôm cua gắt mà chẳng thấy người bị hất văng ra ngoài cửa sổ? Lực ly tâm rõ như ban ngày! Khi mất ma sát, lực ly tâm sẽ ném xe bay thẳng ra xa tâm!',
    fallacyType: 'NGỤY BIỆN DỰA VÀO CẢM GIÁC CHỦ QUAN (Subjective Validation Fallacy)',
    fallacyExplanation: 'Cảm giác bị hất ra là do cơ thể giữ quán tính chuyển động thẳng (Định luật I Newton), không có lực ly tâm thực nào tác dụng.',

    poeQuestion: 'Nếu mặt đường đột ngột mất ma sát (hoặc dây buộc bị cắt đứt), xe sẽ bay theo hướng nào?',
    poeOptions: [
      { id: 'opt1', text: 'Bay thẳng vuông góc ra xa tâm (xuyên tâm) do lực ly tâm kéo.' },
      { id: 'opt2', text: 'Bay theo phương tiếp tuyến với quỹ đạo cong do quán tính (Định luật I Newton).', correct: true },
      { id: 'opt3', text: 'Xe tự động dừng lại ngay lập tức tại chỗ.' }
    ],

    socraticDuel: {
      initialSophosHp: 100,
      rounds: [
        {
          sophosAttack: 'Ngươi dám bảo không có lực ly tâm? Vậy nút "Cắt Dây Quán Tính" trên mô phỏng của ngươi sẽ cho xe bay về đâu?',
          socratesHint: {
            t1: 'Bấm nút "Cắt Dây / Bỏ bám đường" trên màn hình mô phỏng ngay lúc này!',
            t2: 'Nhìn vector vận tốc màu xanh lá cây tại điểm bị cắt.',
            t3: 'Vector vận tốc v luôn có phương tiếp tuyến. Định luật I: Khi F_hl = 0, vật chuyển động thẳng đều theo v tiếp tuyến!'
          },
          responses: [
            {
              id: 'r1',
              text: 'Mô phỏng chứng minh xe bay vọt theo phương TIẾP TUYẾN, hoàn toàn không hề bay xuyên tâm! Đó là quán tính thẳng đều!',
              damage: 100,
              correct: true,
              feedback: 'Thực nghiệm trực quan đã dập tắt hoàn toàn luận điệu của Dr. Sophos!'
            }
          ]
        }
      ]
    },

    verdicts: [
      {
        id: 'v_perfect',
        title: 'BẢN ÁN CHÂN LÝ: XÓA SỔ ẢO TƯỞNG LỰC LY TÂM',
        result: 'perfect',
        summary: 'Trong hệ quy chiếu mặt đất (quán tính), chỉ có Lực hướng tâm giữ xe bẻ cong quỹ đạo. Khi mất lực hướng tâm, xe bay theo phương tiếp tuyến do quán tính.'
      }
    ]
  },

  {
    id: 'case4',
    title: 'VỤ ÁN 4: ĐÈO DỐC MA SÁT KỲ LẠ - TRANH CÃI GÓC NGHIÊNG',
    subtitle: 'Mặt phẳng nghiêng, Phân tích lực & Ma sát trượt',
    curriculum: 'Vật lý 10 - Bài 14: Lực ma sát và mặt phẳng nghiêng',
    badge: 'PHÂN TÍCH LỰC',
    simModule: 'case4',
    description: 'Tài xế xe tải chở hàng xuống đèo dốc 45 độ bị mất phanh trượt dốc. Đội cứu hộ tranh cãi: Có người bảo tăng độ dốc lên thì lực ma sát vẫn thế vì khối lượng xe không đổi.',
    
    classifyItems: [
      {
        id: 'c4_1',
        text: 'Khối lượng hàng hóa m = 10kg, hệ số ma sát giữa gỗ và thép mu = 0.35.',
        type: 'fact',
        explanation: 'Đại lượng đo lường thực tế.'
      },
      {
        id: 'c4_2',
        text: 'Dù đèo dốc bao nhiêu độ thì ma sát vẫn bằng mu * m * g vì trọng lượng xe không đổi.',
        type: 'opinion',
        explanation: 'Nhầm lẫn nghiêm trọng: F_ms = mu * N chứ không phải mu * P.'
      },
      {
        id: 'c4_3',
        text: 'Khi góc dốc tăng lên, áp lực N = mg*cos(alpha) giảm xuống khiến lực ma sát trượt giảm mạnh.',
        type: 'hypothesis',
        explanation: 'Lập luận phân tích lực khoa học cần kiểm chứng.'
      }
    ],

    sophosStatement: 'Công thức ma sát ai chả biết F_ms phụ thuộc khối lượng! Xe vẫn nặng ngần ấy tấn thì ma sát làm sao mà tụt được? Đừng có lừa tôi!',
    fallacyType: 'NGỤY BIỆN ĐÁNH TRÁO KHÁI NIỆM (Equivocation: Đánh tráo Trọng lực P với Áp lực N)',
    fallacyExplanation: 'Trên mặt phẳng nghiêng, áp lực N chỉ là thành phần pháp tuyến P_y = mg*cos(alpha).',

    poeQuestion: 'Khi tăng góc nghiêng của mặt phẳng nghiêng từ 10 độ lên 60 độ, lực ma sát trượt sẽ biến đổi thế nào?',
    poeOptions: [
      { id: 'opt1', text: 'Giữ nguyên không đổi vì m và mu không đổi.' },
      { id: 'opt2', text: 'Giảm liên tục vì áp lực N = mg*cos(alpha) giảm khi góc alpha tăng.', correct: true },
      { id: 'opt3', text: 'Tăng lên vì xe trượt nhanh hơn.' }
    ],

    socraticDuel: {
      initialSophosHp: 100,
      rounds: [
        {
          sophosAttack: 'Tại sao góc nghiêng lớn thì áp lực N lại giảm? Giải thích bằng hình học xem nào!',
          socratesHint: {
            t1: 'Hãy chiếu trọng lực P lên hai trục vuông góc và song song với mặt dốc.',
            t2: 'Thành phần ép vuông góc vào mặt dốc là P_y = P * cos(alpha).',
            t3: 'Khi alpha tăng từ 0 lên 90 độ, cos(alpha) giảm từ 1 về 0. Khi dốc dựng đứng 90 độ, N = 0!'
          },
          responses: [
            {
              id: 'r1',
              text: 'N = mg*cos(alpha). Góc alpha càng dốc, cos(alpha) càng nhỏ làm áp lực N giảm, do đó F_ms = mu*N giảm mạnh!',
              damage: 100,
              correct: true,
              feedback: 'Phân tích vector chuẩn mực! Dr. Sophos không thể chối cãi.'
            }
          ]
        }
      ]
    },

    verdicts: [
      {
        id: 'v_perfect',
        title: 'BẢN ÁN KHOA HỌC: LÀM RÕ BẢN CHẤT LỰC PHÁP TUYẾN',
        result: 'perfect',
        summary: 'Lực ma sát trượt phụ thuộc áp lực pháp tuyến N = mg*cos(alpha). Càng dốc, N càng bé dẫn đến ma sát càng giảm, xe trượt càng nhanh.'
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
    description: 'Một vụ thử nghiệm xe bọc thép 2000kg đâm dính chặt vào xe thứ hai 2000kg đang đứng yên. Giám đốc dự án tức giận: "Tại sao tổng động năng sau va chạm lại mất đi một nửa? Ai đã ăn cắp năng lượng của tôi?"',
    
    classifyItems: [
      {
        id: 'c5_1',
        text: 'Trước va chạm xe 1 có động năng Wd1 = 400 kJ; sau va chạm hai xe dính nhau có tổng động năng Wd2 = 200 kJ.',
        type: 'fact',
        explanation: 'Số liệu đo đạc năng lượng trước và sau va chạm.'
      },
      {
        id: 'c5_2',
        text: 'Năng lượng tự nhiên biến mất vi phạm định luật bảo toàn năng lượng.',
        type: 'opinion',
        explanation: 'Nhầm lẫn giữa Động năng (cơ học) với Toàn bộ năng lượng hệ thống.'
      },
      {
        id: 'c5_3',
        text: 'Trong va chạm mềm, động lượng luôn bảo toàn nhưng cơ năng chuyển hóa thành biến dạng và nội nhiệt.',
        type: 'hypothesis',
        explanation: 'Nguyên lý va chạm mềm trong nhiệt động học.'
      }
    ],

    sophosStatement: 'Các người học vẹt định luật bảo toàn năng lượng mà lại để mất 200 kJ động năng à? Định luật bảo toàn sai bét rồi!',
    fallacyType: 'NGỤY BIỆN BÙ NHÌN RƠM (Strawman: Đánh đồng bảo toàn cơ năng với bảo toàn toàn phần)',
    fallacyExplanation: 'Định luật bảo toàn năng lượng áp dụng cho toàn phần (nhiệt + cơ), còn cơ năng không bắt buộc bảo toàn trong va chạm mềm.',

    poeQuestion: 'Khi hai xe dính chặt vào nhau sau va chạm (va chạm mềm), động lượng và động năng bảo toàn thế nào?',
    poeOptions: [
      { id: 'opt1', text: 'Cả động lượng và động năng đều được bảo toàn 100%.' },
      { id: 'opt2', text: 'Động lượng bảo toàn, nhưng động năng bị hao hụt một phần chuyển thành nhiệt năng và công biến dạng.', correct: true },
      { id: 'opt3', text: 'Cả hai đều bị tiêu tán hoàn toàn về 0.' }
    ],

    socraticDuel: {
      initialSophosHp: 100,
      rounds: [
        {
          sophosAttack: 'Vậy 200 kJ động năng biến đi đâu? Hãy chỉ ra nó đang ở dạng nào!',
          socratesHint: {
            t1: 'Hãy sờ vào đầu xe sau vụ đâm dính: Nó nóng lên hay lạnh đi?',
            t2: 'Sắt thép bị bẹp dúm cần một công cơ học để phá vỡ liên kết tinh thể.',
            t3: '200 kJ đã biến thành Nội năng (nhiệt lượng tỏa ra môi trường) và Công biến dạng dẻo!'
          },
          responses: [
            {
              id: 'r1',
              text: '200 kJ đã chuyển hóa thành Nhiệt năng làm nóng đầu xe và Công làm biến dạng dẻo kim loại, tổng năng lượng vẫn bảo toàn tuyệt đối!',
              damage: 100,
              correct: true,
              feedback: 'Tuyệt đỉnh! Lý thuyết Nhiệt động lực học và Va chạm mềm được giải thích sáng tỏ.'
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
        summary: 'Động lượng bảo toàn p1 = (m1+m2)vf. Động năng hao hụt chuyển hóa thành nội nhiệt và công biến dạng dẻo.'
      }
    ]
  },

  {
    id: 'case6',
    title: 'VỤ ÁN 6: CÚ NHẢY TẦNG BÌNH LƯU - VẬN TỐC TỚI HẠN & CHIẾC DÙ CỨU SINH',
    subtitle: 'Lực cản môi trường & Vận tốc tới hạn (Terminal Velocity)',
    curriculum: 'Vật lý 10 - Bài 11: Lực cản của chất lưu',
    badge: 'CHẤT LƯU',
    simModule: 'case6',
    description: 'Một phi hành gia nhảy dù từ độ cao 30.000m. Người ta tranh cãi: Càng rơi lâu trong không khí thì vận tốc sẽ tăng mãi mãi đến vô hạn hay sẽ dừng lại ở một ngưỡng tối đa?',
    
    classifyItems: [
      {
        id: 'c6_1',
        text: 'Vận tốc kế ghi nhận sau khi bung dù, vận tốc người nhảy giảm và duy trì ổn định ở mức 5.5 m/s.',
        type: 'fact',
        explanation: 'Số liệu đo lường thực tế.'
      },
      {
        id: 'c6_2',
        text: 'Vật thể rơi tự do thì lúc nào cũng có gia tốc g nên vận tốc luôn tăng không có điểm dừng.',
        type: 'opinion',
        explanation: 'Ngộ nhận do quên mất lực cản không khí tăng tỉ lệ thuận với v².'
      },
      {
        id: 'c6_3',
        text: 'Khi lực cản khí bằng trọng lực (F_cản = P), gia tốc a = 0 và vật đạt vận tốc tới hạn.',
        type: 'hypothesis',
        explanation: 'Cơ chế trạng thái cân bằng động trong chất lưu.'
      }
    ],

    sophosStatement: 'Trọng lực kéo liên tục 24/7 thì gia tốc phải có mãi! Làm sao mà vận tốc lại chịu dừng lại được? Vận tốc tới hạn chỉ là bịa đặt!',
    fallacyType: 'NGỤY BIỆN BỎ QUA BIẾN SỐ ĐỘNG (Ignoring Dynamic Variable: Bỏ qua F_cản phụ thuộc vào v²)',
    fallacyExplanation: 'Lực cản không phải là hằng số mà tăng theo bình phương vận tốc, dẫn đến trạng thái tự cân bằng.',

    poeQuestion: 'Khi một người nhảy dù rơi trong không khí đủ lâu, chuyển động của người đó sẽ trở thành gì?',
    poeOptions: [
      { id: 'opt1', text: 'Chuyển động nhanh dần đều với gia tốc g không đổi.' },
      { id: 'opt2', text: 'Chuyển động thẳng đều với vận tốc không đổi gọi là Vận tốc tới hạn (a = 0).', correct: true },
      { id: 'opt3', text: 'Chuyển động chậm dần và dừng lại lơ lửng trên không trung.' }
    ],

    socraticDuel: {
      initialSophosHp: 100,
      rounds: [
        {
          sophosAttack: 'Khi nào thì gia tốc rơi a trở về số 0 nếu Trái Đất vẫn hút người đó với lực P = mg?',
          socratesHint: {
            t1: 'Viết phương trình định luật II Newton: F_net = P - F_cản = ma.',
            t2: 'Khi vận tốc v tăng, F_cản = 1/2*rho*C_d*A*v² sẽ tăng đến khi nào?',
            t3: 'Khi F_cản = P thì Hợp lực F_net = 0, suy ra a = F_net / m = 0! Vận tốc không tăng thêm được nữa!'
          },
          responses: [
            {
              id: 'r1',
              text: 'Khi F_cản tăng đến bằng đúng P, hợp lực F_net = 0 nên a = 0. Vận tốc đạt giá trị tới hạn v_terminal và rơi thẳng đều!',
              damage: 100,
              correct: true,
              feedback: 'Quá chuẩn xác! Bấm nút "Bung Dù" trên mô phỏng để chứng minh diện tích A tăng làm giảm v_terminal giúp tiếp đất an toàn!'
            }
          ]
        }
      ]
    },

    verdicts: [
      {
        id: 'v_perfect',
        title: 'BẢN ÁN CÂN BẰNG ĐỘNG LỰC HỌC CHẤT LƯU',
        result: 'perfect',
        summary: 'Vật rơi trong chất lưu đạt vận tốc tới hạn khi F_cản = P (a = 0). Chiếc dù tăng diện tích cản A giúp giảm vận tốc tới hạn xuống mức an toàn cho con người.'
      }
    ]
  }
];
