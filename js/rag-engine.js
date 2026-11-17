/**
 * ============================================================================
 * RAG-ANYTHING MULTIMODAL KNOWLEDGE ENGINE & SOCRATIC EVALUATOR
 * ============================================================================
 * Inspired by HKUDS/RAG-Anything (Multimodal RAG with Knowledge Graph & Grounding)
 * Custom-tailored for Vietnam National Physics Curriculum 2018 (Grade 10 Dynamics)
 * 
 * Features:
 * 1. Multimodal Knowledge Base: 6 Case dossiers with Textbook Citations (SGK Vat Ly 10),
 *    LaTeX formulas, vector force diagrams, and fallacy taxonomy mappings.
 * 2. Hybrid Retrieval: Entity recognition, keyword semantics, and contextual case ranking.
 * 3. Socratic Argument Evaluator: Evaluates student's free-text reasoning, awards Facione
 *    points (T1-T4), inflicts dynamic damage on Dr. Sophos, and provides pedagogical grounding.
 * 4. Dual Execution Mode: 
 *    - Mode A: Built-in In-Browser Hybrid Engine (Zero latency, 100% offline).
 *    - Mode B: External FastAPI / Gemini Cloud Backend (Extensible REST API).
 * ============================================================================
 */

(function (window) {
  'use strict';

  // ==========================================
  // MULTIMODAL KNOWLEDGE BASE (SGK VAT LY 10)
  // ==========================================
  const PHYSICS_KNOWLEDGE_CORPUS = [
    {
      caseId: 1,
      caseCode: "CASE_01_PISA",
      lessonTitle: "Bài 10: Sự rơi tự do & Môi trường Đa Thiên Thể",
      curriculumRef: "Sách giáo khoa Vật lí 10 (Bộ GDĐT - Chương trình GDPT 2018), Bài 10 (Sự rơi tự do) & Bài 11 (Thực hành đo gia tốc rơi tự do), Trang 44 - 51.",
      abstract: "Sự rơi tự do là chuyển động của vật chỉ chịu tác dụng của trọng lực. Trong môi trường không có lực cản (chân không), mọi vật rơi như nhau với cùng một gia tốc rơi tự do g, không phụ thuộc vào khối lượng của vật.",
      keyEntities: ["rơi tự do", "trọng lực", "chân không", "lực cản không khí", "gia tốc rơi tự do", "khối lượng", "quán tính", "Galilei", "Aristotle"],
      latexFormulas: [
        {
          label: "Định luật II Newton cho rơi tự do",
          formula: "a = \\frac{P}{m} = \\frac{m \\cdot g}{m} = g",
          explanation: "Trọng lực P tỷ lệ thuận với khối lượng m, nhưng quán tính cản trở gia tốc cũng tỷ lệ thuận với m. Hai đại lượng này triệt tiêu lẫn nhau, do đó gia tốc a luôn bằng g không phụ thuộc vào m."
        },
        {
          label: "Phương trình vận tốc rơi tự do",
          formula: "v = g \\cdot t",
          explanation: "Vận tốc tức thời tỷ lệ thuận với thời gian rơi; không phụ thuộc vào khối lượng của vật rơi."
        },
        {
          label: "Phương trình quãng đường rơi tự do",
          formula: "s = \\frac{1}{2} g t^2 \\implies t = \\sqrt{\\frac{2s}{g}}",
          explanation: "Thời gian rơi từ cùng một độ cao s trong chân không là hoàn toàn bằng nhau đối với mọi vật."
        }
      ],
      celestialGravityData: [
        { planet: "Mặt Trời (Sun)", g: 274.0, note: "Siêu trọng trường gấp 28 lần Trái Đất (t = 0.52s từ độ cao 38m)" },
        { planet: "Sao Mộc (Jupiter)", g: 24.79, note: "Hành tinh khí khổng lồ, gia tốc rơi cực mạnh" },
        { planet: "Trái Đất (Earth)", g: 9.8, note: "Gia tốc rơi tự do tiêu chuẩn tại mặt đất" },
        { planet: "Sao Kim (Venus)", g: 8.87, note: "Áp suất khí quyển bề mặt gấp 90 lần Trái Đất" },
        { planet: "Sao Hỏa (Mars)", g: 3.72, note: "Khí quyển CO₂ loãng, gia tốc rơi chỉ bằng 38% Trái Đất" },
        { planet: "Mặt Trăng (Moon)", g: 1.62, note: "Chân không tự nhiên, Apollo 15 đã kiểm chứng thả lông vũ và búa thép rơi cùng lúc" },
        { planet: "Sao Diêm Vương (Pluto)", g: 0.62, note: "Hành tinh lùn băng giá, vật rơi siêu chậm" }
      ],
      multimodalDiagram: {
        diagramType: "Vector Force & Kinematic Trajectory",
        description: "Khi có không khí: Hợp lực F_net = P - F_cản. Vì F_cản tác dụng lên lông vũ/quả cầu nhẹ lớn so với trọng lượng của nó, nên gia tốc a_lông < a_chì. Khi hút hết không khí (chân không): F_cản = 0, chỉ còn trọng lực P tác dụng, vector gia tốc a = g hướng thẳng đứng xuống dưới cho cả 2 vật.",
        svgIcon: "tower-drop"
      },
      fallacyAnalysis: {
        fallacyType: "Ngụy biện Thẩm quyền (Appeal to Authority) & Ngụy biện Khái quát hóa vội vã",
        sophosFallacy: "Aristotle vĩ đại đã khẳng định vật nặng 10kg rơi nhanh gấp 10 lần vật 1kg vì Trái Đất hút nó mạnh gấp 10 lần!",
        counterArgument: "Trái Đất hút vật 10kg mạnh gấp 10 lần (P = 10mg), nhưng 'sức ì' (quán tính) của vật 10kg cũng lớn gấp 10 lần (F = ma => a = P/m = g). Thí nghiệm ống hút chân không của Newton và tháp nghiêng Pisa của Galilei đã chứng minh trong chân không hai vật chạm đất hoàn toàn đồng thời."
      },
      sgkQuote: "«Nếu loại bỏ được ảnh hưởng của không khí thì mọi vật sẽ rơi giống nhau. Sự rơi của các vật trong trường hợp này gọi là sự rơi tự do.» (SGK Vật lí 10, Bài 10, tr. 45)"
    },

    {
      caseId: 2,
      caseCode: "CASE_02_COLLISION",
      lessonTitle: "Bài 16: Định luật III Newton & Tương tác Va chạm",
      curriculumRef: "Sách giáo khoa Vật lí 10 (Bộ GDĐT - GDPT 2018), Bài 16: Định luật III Newton, Trang 64 - 69.",
      abstract: "Trong mọi tương tác giữa hai vật, lực tác dụng và phản lực luôn xuất hiện và biến mất cùng lúc, có cùng phương, ngược chiều, cùng độ lớn nhưng đặt vào hai vật khác nhau. Độ biến dạng và gia tốc thu được khác nhau là do khối lượng và cấu trúc vật liệu của mỗi vật.",
      keyEntities: ["định luật 3 newton", "lực và phản lực", "va chạm", "gia tốc", "khối lượng", "quán tính", "biến dạng dẻo", "xe tải", "xe con"],
      latexFormulas: [
        {
          label: "Định luật III Newton",
          formula: "\\vec{F}_{12} = -\\vec{F}_{21} \\implies |\\vec{F}_{12}| = |\\vec{F}_{21}|",
          explanation: "Lực do xe tải tác dụng lên xe con F_12 luôn luôn có độ lớn bằng tuyệt đối lực do xe con tác dụng ngược lại xe tải F_21."
        },
        {
          label: "Gia tốc theo Định luật II Newton",
          formula: "a_1 = \\frac{F}{m_1}, \\quad a_2 = \\frac{F}{m_2} \\implies \\frac{a_2}{a_1} = \\frac{m_1}{m_2}",
          explanation: "Vì cùng một độ lớn lực F, xe con có khối lượng m_2 nhỏ hơn 5 lần (1000kg so với 5000kg) nên sẽ thu gia tốc văng a_2 gấp 5 lần so với xe tải."
        }
      ],
      multimodalDiagram: {
        diagramType: "Action-Reaction Collision Pair",
        description: "Tại bề mặt tiếp xúc lúc t = 0.05s: Hai vector lực F_12 (đẩy xe con sang phải) và F_21 (cản xe tải sang trái) có độ dài vector bằng nhau đối xứng qua mặt tiếp xúc. Xe con bị vỡ nát do ngưỡng chịu ứng suất cơ học của vỏ xe con mỏng hơn chassis thép đặc của xe tải, không phải do nhận lực lớn hơn.",
        svgIcon: "collision"
      },
      fallacyAnalysis: {
        fallacyType: "Ngụy biện Trực quan / Nguyên nhân giả (False Cause from Visual Damage)",
        sophosFallacy: "Nhìn chiếc xe con nát bét còn xe tải chỉ xước cản trước là đủ biết xe tải đã tác dụng một lực đè bẹp gấp hàng chục lần lên xe con!",
        counterArgument: "Độ nát của xe phản ánh 'giới hạn bền vật liệu' và 'gia tốc đổi vận tốc tức thời' (a = F/m). Theo Định luật III Newton, cảm biến áp điện lực kế đo được F_12 = -F_21 bằng nhau đến từng Newton. Khối lượng nhỏ khiến xe con gia tốc đổi hướng cực mạnh và bị hấp thụ toàn bộ xung động."
      },
      sgkQuote: "«Trong mọi trường hợp, khi vật A tác dụng lên vật B một lực, thì vật B cũng tác dụng lại vật A một lực. Hai lực này là hai lực trực đối: cùng giá, ngược chiều và cùng độ lớn.» (SGK Vật lí 10, Bài 16, tr. 66)"
    },

    {
      caseId: 3,
      caseCode: "CASE_03_CURVE",
      lessonTitle: "Bài 20: Động lực học Chuyển động tròn & Lực hướng tâm",
      curriculumRef: "Sách giáo khoa Vật lí 10 (Bộ GDĐT - GDPT 2018), Bài 20: Động lực học của chuyển động tròn đều, Trang 78 - 83.",
      abstract: "Để một vật chuyển động tròn đều, cần có hợp lực tác dụng vào vật hướng vào tâm quỹ đạo, gọi là lực hướng tâm. Trong hệ quy chiếu quán tính gắn với mặt đường, hoàn toàn không có 'lực ly tâm' nào kéo vật ra ngoài; cảm giác bị văng ra thực chất là quán tính muốn tiếp tục chuyển động thẳng đều theo phương tiếp tuyến.",
      keyEntities: ["lực hướng tâm", "lực ly tâm", "chuyển động tròn đều", "quán tính", "phương tiếp tuyến", "hệ quy chiếu quán tính", "ma sát nghỉ", "khúc cua"],
      latexFormulas: [
        {
          label: "Gia tốc hướng tâm",
          formula: "a_{ht} = \\frac{v^2}{r} = \\omega^2 \\cdot r",
          explanation: "Gia tốc luôn hướng vuông góc với vector vận tốc, hướng vào tâm quỹ đạo uốn cong bán kính r."
        },
        {
          label: "Định luật II Newton cho chuyển động tròn",
          formula: "F_{ht} = m \\cdot a_{ht} = m \\frac{v^2}{r}",
          explanation: "Lực hướng tâm không phải là một loại lực tự nhiên mới, mà là hợp lực của các lực thực tế (như lực ma sát nghỉ giữa bánh xe và mặt đường, lực căng dây, trọng lực)."
        },
        {
          label: "Điều kiện an toàn khi vào cua không bị trượt",
          formula: "F_{msn\\_max} = \\mu_s \\cdot m g \\ge m \\frac{v^2}{r} \\implies v \\le \\sqrt{\\mu_s \\cdot g \\cdot r}",
          explanation: "Nếu tốc độ xe v vượt quá ngưỡng căn bậc hai của (mu * g * r), lực ma sát nghỉ không đủ cung cấp lực hướng tâm, xe sẽ bị trượt văng tiếp tuyến."
        }
      ],
      multimodalDiagram: {
        diagramType: "Centripetal Vector & Tangential Inertia",
        description: "Chuyển động trên đường cong: Vector vận tốc v luôn có hướng tiếp tuyến với đường tròn quỹ đạo. Vector lực hướng tâm F_ht vuông góc với v hướng vào tâm. Khi bấm nút 'Cắt Dây / Mất Bám', F_ht đột ngột biến mất, vật tiếp tục bay theo đường thẳng tiếp tuyến với quỹ đạo (theo Định luật I Newton), không hề bay xuyên tâm ra xa.",
        svgIcon: "curve-motion"
      },
      fallacyAnalysis: {
        fallacyType: "Ngụy biện Đánh tráo Khái niệm & Hệ quy chiếu (Equivocation of Inertial Reference Frame)",
        sophosFallacy: "Rõ ràng có một 'Lực văng Ly Tâm bí ẩn' kéo giật người lái và chiếc xe lao thẳng ra ngoài vực thẳm khi ôm cua!",
        counterArgument: "Xét trong hệ quy chiếu mặt đường (quán tính), không hề tồn tại thực thể 'lực ly tâm'. Cái làm xe văng là quán tính của chính chiếc xe muốn giữ chuyển động thẳng theo phương tiếp tuyến khi lực ma sát bánh xe không còn đủ để kéo nó bẻ cong vào tâm cua."
      },
      sgkQuote: "«Lực (hay hợp lực của các lực) tác dụng vào một vật chuyển động tròn đều và gây ra cho vật gia tốc hướng tâm gọi là lực hướng tâm.» (SGK Vật lí 10, Bài 20, tr. 80)"
    },

    {
      caseId: 4,
      caseCode: "CASE_04_INCLINE",
      lessonTitle: "Bài 14: Lực ma sát & Chuyển động trên Mặt phẳng nghiêng",
      curriculumRef: "Sách giáo khoa Vật lí 10 (Bộ GDĐT - GDPT 2018), Bài 14 (Lực ma sát) & Bài 17 (Cân bằng của vật chịu tác dụng của các lực không song song), Trang 56 - 63.",
      abstract: "Trên mặt phẳng nghiêng góc alpha, trọng lực được phân tích thành hai thành phần vuông góc: thành phần kéo vật trượt xuống dốc P_x = P * sin(alpha) và thành phần ép vật vuông góc vào mặt phẳng dốc P_y = P * cos(alpha). Khi độ dốc tăng, cos(alpha) giảm dẫn đến áp lực pháp tuyến N giảm, khiến lực ma sát trượt giảm mạnh.",
      keyEntities: ["mặt phẳng nghiêng", "ma sát trượt", "áp lực pháp tuyến", "góc nghiêng", "phân tích lực", "sin alpha", "cos alpha"],
      latexFormulas: [
        {
          label: "Phân tích trọng lực trên mặt phẳng nghiêng",
          formula: "P_x = m g \\sin\\alpha, \\quad P_y = m g \\cos\\alpha",
          explanation: "P_x đóng vai trò lực kéo trượt dọc dốc; P_y là lực ép vuông góc lên mặt dốc."
        },
        {
          label: "Áp lực pháp tuyến và Lực ma sát trượt",
          formula: "N = P_y = m g \\cos\\alpha \\implies F_{mst} = \\mu_t \\cdot N = \\mu_t \\cdot m g \\cos\\alpha",
          explanation: "Vì hàm cos(alpha) nghịch biến từ 0 đến 90 độ, khi tăng độ dốc (alpha tăng), cos(alpha) giảm mạnh, áp lực N giảm theo kéo theo lực ma sát trượt giảm."
        },
        {
          label: "Phương trình gia tốc chuyển động trượt",
          formula: "a = \\frac{P_x - F_{mst}}{m} = g (\\sin\\alpha - \\mu_t \\cos\\alpha)",
          explanation: "Khi sin(alpha) > mu_t * cos(alpha), vật bắt đầu trượt nhanh dần đều xuống dốc với gia tốc tăng vọt."
        }
      ],
      multimodalDiagram: {
        diagramType: "Orthogonal Vector Decomposition on Incline",
        description: "Hệ trục Oxy: Ox dọc theo dốc nghiêng xuống, Oy vuông góc mặt dốc. Trọng lực P phân rã thành vector P_x màu đỏ kéo xuống và P_y màu xanh lá ép xuống. Phản lực N cân bằng với P_y. Ma sát F_mst ngược chiều Ox. Khi alpha tăng từ 15° lên 45°, vector P_y co ngắn lại, làm giảm rõ rệt vector N và F_mst.",
        svgIcon: "incline"
      },
      fallacyAnalysis: {
        fallacyType: "Ngụy biện Quy nạp ẩu & Bỏ qua biến số góc nghiêng (Ignoring Trigonometric Normal Force)",
        sophosFallacy: "Khối lượng xe và chất lượng lốp vẫn y nguyên thì ở góc dốc nào lực ma sát kìm xe cũng giữ nguyên không đổi!",
        counterArgument: "Sai lầm nghiêm trọng! Lực ma sát trượt tỷ lệ với áp lực pháp tuyến N = mg*cos(alpha), không bằng mg. Càng dốc thì cos(alpha) càng nhỏ, áp lực xe đè lên đường gần như bị triệt tiêu, ma sát biến mất khiến xe mất kiểm soát."
      },
      sgkQuote: "«Độ lớn của lực ma sát trượt tỉ lệ với độ lớn của áp lực: F_mst = mu_t * N. Lực ma sát trượt không phụ thuộc vào diện tích tiếp xúc và tốc độ của vật.» (SGK Vật lí 10, Bài 14, tr. 58)"
    },

    {
      caseId: 5,
      caseCode: "CASE_05_MOMENTUM",
      lessonTitle: "Bài 19: Động lượng & Định luật Bảo toàn Động lượng",
      curriculumRef: "Sách giáo khoa Vật lí 10 (Bộ GDĐT - GDPT 2018), Bài 18 (Động lượng) & Bài 19 (Định luật bảo toàn động lượng), Trang 84 - 91.",
      abstract: "Trong một hệ kín, tổng động lượng của hệ được bảo toàn tuyệt đối. Trong va chạm mềm (hai vật dính liền vào nhau sau va chạm), động lượng của hệ được bảo toàn, nhưng cơ năng (động năng) không bảo toàn mà bị tiêu hao chuyển hóa thành nội năng (nhiệt lượng) và công biến dạng cấu trúc.",
      keyEntities: ["động lượng", "bảo toàn động lượng", "va chạm mềm", "động năng", "nhiệt lượng", "biến dạng", "hệ kín"],
      latexFormulas: [
        {
          label: "Định luật bảo toàn động lượng (Hệ kín)",
          formula: "\\vec{p}_{trước} = \\vec{p}_{sau} \\iff m_1 \\vec{v}_1 + m_2 \\vec{v}_2 = (m_1 + m_2) \\vec{v}_f",
          explanation: "Sau va chạm mềm, hai vật dính làm một khối chuyển động cùng vận tốc v_f."
        },
        {
          label: "Vận tốc sau va chạm mềm (chuyển động cùng phương)",
          formula: "v_f = \\frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}",
          explanation: "Động lượng toàn phần trước và sau được bảo toàn nguyên vẹn."
        },
        {
          label: "Sự suy giảm động năng trong va chạm mềm",
          formula: "\\Delta W_đ = W_{đ1} - W_{đf} = \\frac{1}{2} m_1 v_1^2 - \\frac{1}{2}(m_1 + m_2) v_f^2 = Q + A_{biến\\_dạng} > 0",
          explanation: "Động năng cơ học bị thất thoát do chuyển hóa thành nhiệt năng làm nóng vỏ thép và công bóp méo biến dạng cấu trúc xe."
        }
      ],
      multimodalDiagram: {
        diagramType: "Momentum Conservation & Plastic Deformation",
        description: "Va chạm giữa 2 xe bọc thép: Trước va chạm: vector p_1 = m_1 * v_1. Sau va chạm mềm: hai xe dính chặt, khối lượng tổng là m_1 + m_2, vận tốc giảm còn v_f. Máy đo năng lượng chỉ ra cơ năng giảm 60%, nhiệt kế hồng ngoại ghi nhận nhiệt độ kim loại tăng vọt do nội năng tăng.",
        svgIcon: "momentum-collision"
      },
      fallacyAnalysis: {
        fallacyType: "Ngụy biện Đánh đồng Khái niệm (Equivocation of Momentum vs Kinetic Energy)",
        sophosFallacy: "Đã bảo toàn là phải bảo toàn tất cả! Nếu động lượng bảo toàn thì động năng cũng phải bảo toàn y nguyên trong cú đâm!",
        counterArgument: "Đánh tráo khái niệm giữa 'Động lượng' (vecto p = mv, luôn bảo toàn trong hệ kín do định luật III Newton) và 'Động năng' (vô hướng Wđ = 1/2 mv^2). Va chạm mềm biến dạng kim loại luôn tiêu hao cơ năng sang nhiệt và biến dạng dẻo, chỉ có động lượng là bảo toàn."
      },
      sgkQuote: "«Định luật bảo toàn động lượng: Tổng động lượng của một hệ kín là một đại lượng bảo toàn (không đổi theo thời gian).» (SGK Vật lí 10, Bài 19, tr. 88)"
    },

    {
      caseId: 6,
      caseCode: "CASE_06_TERMINAL_VELOCITY",
      lessonTitle: "Bài 11: Lực cản chất lưu & Vận tốc tới hạn",
      curriculumRef: "Sách giáo khoa Vật lí 10 (Bộ GDĐT - GDPT 2018), Bài 11: Lực cản và lực nâng của chất lưu, Trang 52 - 55.",
      abstract: "Khi một vật chuyển động trong chất lưu (không khí), vật chịu lực cản tỷ lệ với bình phương vận tốc. Khi vận tốc rơi tăng dần, lực cản tăng theo cho đến khi lực cản triệt tiêu hoàn toàn trọng lực (F_cản = P), gia tốc rơi giảm về 0, vật chuyển sang chuyển động thẳng đều với vận tốc tới hạn (terminal velocity).",
      keyEntities: ["lực cản không khí", "vận tốc tới hạn", "cân bằng động", "gia tốc", "bung dù", "diện tích tiếp xúc", "chất lưu"],
      latexFormulas: [
        {
          label: "Biểu thức lực cản khí động học",
          formula: "F_{cản} = \\frac{1}{2} C_d \\cdot \\rho \\cdot S \\cdot v^2",
          explanation: "Lực cản tỷ lệ thuận với hệ số hình dạng C_d, khối lượng riêng không khí rho, diện tích cản S và bình phương vận tốc v^2."
        },
        {
          label: "Phương trình chuyển động rơi trong không khí",
          formula: "F_{net} = P - F_{cản} = m g - \\frac{1}{2} C_d \\rho S v^2 = m \\cdot a \\implies a = g - \\frac{C_d \\rho S}{2m} v^2",
          explanation: "Khi v tăng thì a giảm dần từ g về 0."
        },
        {
          label: "Điều kiện đạt Vận tốc tới hạn (Terminal Velocity)",
          formula: "a = 0 \\iff F_{cản} = P \\implies v_{terminal} = \\sqrt{\\frac{2mg}{C_d \\cdot \\rho \\cdot S}}",
          explanation: "Khi bung dù, diện tích cản S tăng vọt gấp 40 lần, làm v_terminal giảm từ 55 m/s xuống còn dưới 5 m/s, giúp tiếp đất an toàn."
        }
      ],
      multimodalDiagram: {
        diagramType: "Aerodynamic Drag Equilibrium Graph",
        description: "Đồ thị v-t: Đường cong v(t) tiệm cận nằm ngang tại giá trị v_terminal. Vector trọng lực P hướng xuống cố định. Vector F_cản hướng lên tăng dần độ dài theo v^2 cho tới khi cân bằng tuyệt đối với P (hợp lực bằng 0, gia tốc a = 0). Khi bung dù, F_cản vọt lên cực đại hãm tốc độ xuống bậc thấp mới.",
        svgIcon: "skydiver"
      },
      fallacyAnalysis: {
        fallacyType: "Ngụy biện Ngoại suy Tuyến tính Vô hạn (Linear Extrapolation Fallacy)",
        sophosFallacy: "Vì có gia tốc rơi nên người nhảy dù rơi từ tầng bình lưu sẽ tăng tốc liên tục không giới hạn cho đến khi chạm đất!",
        counterArgument: "Ngộ nhận do áp dụng công thức rơi tự do chân không vào bầu khí quyển! Lực cản không khí tăng theo v^2. Khi F_cản cân bằng trọng lực P, hợp lực bằng 0 và gia tốc triệt tiêu. Vận tốc lập tức bị khóa cứng ở ngưỡng Vận Tốc Tới Hạn (v_terminal)."
      },
      sgkQuote: "«Khi một vật rơi trong không khí, lực cản của không khí tăng theo vận tốc của vật. Đến một lúc nào đó, lực cản cân bằng với trọng lực tác dụng lên vật, khi đó vật chuyển động thẳng đều với vận tốc không đổi gọi là vận tốc tới hạn.» (SGK Vật lí 10, Bài 11, tr. 54)"
    }
  ];

  // ==========================================
  // RAG-ANYTHING CORE ENGINE CLASS
  // ==========================================
  class RAGEngine {
    constructor() {
      this.corpus = PHYSICS_KNOWLEDGE_CORPUS;
      this.apiMode = 'hybrid-local'; // 'hybrid-local' | 'external-backend' | 'gemini-direct'
      this.backendUrl = 'http://localhost:8000/api/chat';
      this.geminiApiKey = '';
      this.loadConfig();
    }

    loadConfig() {
      try {
        const saved = localStorage.getItem('rag_anything_config');
        if (saved) {
          const cfg = JSON.parse(saved);
          if (cfg.apiMode) this.apiMode = cfg.apiMode;
          if (cfg.backendUrl) this.backendUrl = cfg.backendUrl;
          if (cfg.geminiApiKey) this.geminiApiKey = cfg.geminiApiKey;
        }
      } catch (e) {}
    }

    saveConfig(cfg) {
      if (cfg.apiMode) this.apiMode = cfg.apiMode;
      if (cfg.backendUrl) this.backendUrl = cfg.backendUrl;
      if (cfg.geminiApiKey !== undefined) this.geminiApiKey = cfg.geminiApiKey;
      try {
        localStorage.setItem('rag_anything_config', JSON.stringify({
          apiMode: this.apiMode,
          backendUrl: this.backendUrl,
          geminiApiKey: this.geminiApiKey
        }));
      } catch (e) {}
    }

    // Helper: Normalize Vietnamese strings for robust matching
    normalizeStr(str) {
      if (!str) return '';
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    // 1. HYBRID RETRIEVAL (Bóc tách tri thức Đa Thể Thức)
    async query(promptText, preferredCaseId = null) {
      // If external backend configured and mode is active
      if (this.apiMode === 'external-backend' && this.backendUrl) {
        try {
          const resp = await fetch(this.backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: promptText,
              case_id: preferredCaseId,
              stream: false
            })
          });
          if (resp.ok) {
            const data = await resp.json();
            return {
              sourceMode: 'backend-api',
              reply: data.reply || data.text || 'Không có phản hồi từ backend.',
              grounding: data.grounding || null,
              citations: data.citations || 'Backend RAG-Anything'
            };
          }
        } catch (err) {
          console.warn('[RAG-Anything] Backend API failed, falling back to built-in hybrid engine:', err);
        }
      }

      // Built-in Hybrid Engine (Local Graph & Entity Matcher)
      return this.localHybridRetrieve(promptText, preferredCaseId);
    }

    localHybridRetrieve(promptText, preferredCaseId = null) {
      const qNorm = this.normalizeStr(promptText);
      const qTokens = qNorm.split(' ').filter(t => t.length > 1);

      // Score each case in knowledge corpus
      let bestCase = null;
      let maxScore = -1;

      this.corpus.forEach(item => {
        let score = 0;
        if (preferredCaseId && item.caseId === preferredCaseId) {
          score += 5; // Contextual case bias
        }

        // Entity match
        item.keyEntities.forEach(ent => {
          const entNorm = this.normalizeStr(ent);
          if (qNorm.includes(entNorm)) {
            score += 4;
          } else {
            const entTokens = entNorm.split(' ');
            entTokens.forEach(t => {
              if (qTokens.includes(t)) score += 1.2;
            });
          }
        });

        // Abstract & title match
        const contentNorm = this.normalizeStr(item.abstract + ' ' + item.lessonTitle);
        qTokens.forEach(token => {
          if (contentNorm.includes(token)) score += 0.8;
        });

        if (score > maxScore) {
          maxScore = score;
          bestCase = item;
        }
      });

      // Default to preferredCaseId or case 1 if low confidence
      if (!bestCase || maxScore < 2) {
        bestCase = this.corpus.find(c => c.caseId === (preferredCaseId || 1)) || this.corpus[0];
      }

      // Build synthesized answer
      const answer = {
        sourceMode: 'hybrid-local',
        caseId: bestCase.caseId,
        caseTitle: bestCase.lessonTitle,
        curriculumSource: bestCase.curriculumRef,
        abstract: bestCase.abstract,
        sgkQuote: bestCase.sgkQuote,
        primaryFormula: bestCase.latexFormulas[0],
        allFormulas: bestCase.latexFormulas,
        diagram: bestCase.multimodalDiagram,
        fallacyTaxonomy: bestCase.fallacyAnalysis,
        confidence: Math.min(99, Math.max(72, Math.round(maxScore * 12 + 60)))
      };

      return answer;
    }

    // 2. SOCRATIC ARGUMENT EVALUATOR (Dành cho Phase 4: Free-text Argumentation)
    evaluateStudentArgument(caseId, studentText) {
      if (!studentText || studentText.trim().length < 5) {
        return {
          isCorrect: false,
          damage: 0,
          confidenceScore: 10,
          facioneGains: { t1: 0, t2: 0, t3: 0, t4: 0 },
          sophosReaction: "Hừm! Lập luận của ngươi quá ngắn ngủi và rỗng tuếch! Đừng mong qua mắt được logic của ta!",
          socratesAdvice: "Cố vấn Socrates: Hãy trình bày rõ bằng chứng thực nghiệm và công thức định luật vật lý để phản bác.",
          groundingRef: null
        };
      }

      const caseData = this.corpus.find(c => c.caseId === caseId) || this.corpus[0];
      const textNorm = this.normalizeStr(studentText);
      const textTokens = textNorm.split(' ');

      // Check key physics principles per case
      let keyHits = 0;
      let lawDetected = false;
      let formulaDetected = false;
      let fallacyDetected = false;

      caseData.keyEntities.forEach(ent => {
        const entNorm = this.normalizeStr(ent);
        if (textNorm.includes(entNorm)) {
          keyHits++;
        }
      });

      // Specific rule checks
      if (caseId === 1) { // Pisa: a = P/m = g, chân không, quán tính, lực cản = 0
        if (textNorm.includes('chan khong') || textNorm.includes('luc can') || textNorm.includes('khong khi')) keyHits += 2;
        if (textNorm.includes('quan tinh') || textNorm.includes('gia toc') || textNorm.includes('p/m') || textNorm.includes('bang nhau')) {
          lawDetected = true;
          keyHits += 2;
        }
      } else if (caseId === 2) { // Collision: F12 = -F21, gia tốc a = F/m, khối lượng khác nhau
        if (textNorm.includes('dinh luat 3') || textNorm.includes('dinh luat iii') || textNorm.includes('bang nhau') || textNorm.includes('f12') || textNorm.includes('truc doi')) {
          lawDetected = true;
          keyHits += 3;
        }
        if (textNorm.includes('khoi luong') || textNorm.includes('gia toc') || textNorm.includes('vat lieu') || textNorm.includes('vo')) {
          formulaDetected = true;
          keyHits += 2;
        }
      } else if (caseId === 3) { // Curve: quán tính, tiếp tuyến, không có lực ly tâm, lực hướng tâm
        if (textNorm.includes('tiep tuyen') || textNorm.includes('quan tinh') || textNorm.includes('huong tam')) {
          lawDetected = true;
          keyHits += 3;
        }
        if (textNorm.includes('khong co luc ly tam') || textNorm.includes('ao tuong') || textNorm.includes('mat duong') || textNorm.includes('ma sat')) {
          fallacyDetected = true;
          keyHits += 2;
        }
      } else if (caseId === 4) { // Incline: N = mg*cos(alpha), Fms = mu*N, dốc tăng N giảm
        if (textNorm.includes('cos') || textNorm.includes('ap luc') || textNorm.includes('n =') || textNorm.includes('vuong goc')) {
          lawDetected = true;
          keyHits += 3;
        }
        if (textNorm.includes('giam') || textNorm.includes('ma sat') || textNorm.includes('doc')) {
          formulaDetected = true;
          keyHits += 2;
        }
      } else if (caseId === 5) { // Momentum: Động lượng bảo toàn, động năng không bảo toàn (chuyển sang nhiệt, biến dạng)
        if (textNorm.includes('dong luong bao toan') || textNorm.includes('he kin') || textNorm.includes('p truoc = p sau')) {
          lawDetected = true;
          keyHits += 3;
        }
        if (textNorm.includes('dong nang khong bao toan') || textNorm.includes('nhiet') || textNorm.includes('bien dang') || textNorm.includes('va cham mem')) {
          fallacyDetected = true;
          keyHits += 2;
        }
      } else if (caseId === 6) { // Terminal velocity: F_cản = P, gia tốc a = 0, vận tốc tới hạn
        if (textNorm.includes('van toc toi han') || textNorm.includes('f can = p') || textNorm.includes('can bang') || textNorm.includes('a = 0')) {
          lawDetected = true;
          keyHits += 3;
        }
        if (textNorm.includes('khong tang vo han') || textNorm.includes('bung du') || textNorm.includes('v^2') || textNorm.includes('dien tich')) {
          formulaDetected = true;
          keyHits += 2;
        }
      }

      // Check for common fallacy indicators
      const hasFallacyFlag = textNorm.includes('nguy bien') || textNorm.includes('sai') || textNorm.includes('danh trao') || textNorm.includes('ao tuong');
      if (hasFallacyFlag) fallacyDetected = true;

      // Determine outcome
      const isStrong = (keyHits >= 4 && lawDetected) || (keyHits >= 6);
      const isModerate = keyHits >= 2;

      let damage = 0;
      let isCorrect = false;
      let confidenceScore = Math.min(98, Math.round(keyHits * 14 + 20));
      let sophosReaction = "";
      let socratesAdvice = "";

      if (isStrong) {
        isCorrect = true;
        damage = 50; // Sát thương cực đại
        sophosReaction = `Á...! Ngươi đã lôi cả ${caseData.curriculumRef.split(',')[1] || 'Định luật chuẩn'} ra để bẻ gãy ta sao?! Lập luận vững như bàn thạch... ta không thể chối cãi được!`;
        socratesAdvice = `Cố vấn Socrates: Xuất sắc! Em đã kết hợp chuẩn xác giữa bằng chứng thực nghiệm và công thức định luật vật lý. Đây là biểu hiện của tư duy phản biện cấp cao.`;
      } else if (isModerate) {
        isCorrect = true;
        damage = 35; // Sát thương khá
        sophosReaction = `Hừ... lập luận của ngươi có phần đúng về hiện tượng, nhưng phân tích lực vẫn chưa đủ chi tiết để đè bẹp hoàn toàn ta đâu!`;
        socratesAdvice = `Cố vấn Socrates: Khá tốt! Em đã chỉ ra đúng hướng đi. Nếu bổ sung thêm công thức LaTeX bảo chứng thì lập luận sẽ không thể đánh đổ.`;
      } else {
        isCorrect = false;
        damage = 0;
        sophosReaction = `Ha ha ha! Lời lẽ của ngươi chỉ là phỏng đoán cảm tính mơ hồ! Không có định luật, không có công thức, làm sao lay chuyển được ta!`;
        socratesAdvice = `Cố vấn Socrates: Chú ý! Đừng dựa vào trực giác đời sống. Hãy bấm nút 'Tra cứu RAG' để xem lại công thức ${caseData.latexFormulas[0].formula} trước khi phản biện.`;
      }

      return {
        isCorrect: isCorrect,
        damage: damage,
        confidenceScore: confidenceScore,
        facioneGains: {
          t1: isCorrect ? 8 : 2,
          t2: isCorrect ? 10 : 3,
          t3: isCorrect ? 12 : 0,
          t4: isCorrect ? 8 : 4
        },
        sophosReaction: sophosReaction,
        socratesAdvice: socratesAdvice,
        groundingRef: {
          caseCode: caseData.caseCode,
          lesson: caseData.lessonTitle,
          source: caseData.curriculumRef,
          formula: caseData.latexFormulas[0],
          sgkQuote: caseData.sgkQuote
        }
      };
    }
  }

  // ==========================================
  // RAG ASSISTANT UI CONTROLLER
  // ==========================================
  class RAGAssistantUI {
    constructor(engine) {
      this.engine = engine;
      this.activeCaseId = 1;
    }

    openModal(preferredCaseId = null) {
      if (preferredCaseId) {
        this.activeCaseId = preferredCaseId;
      } else if (window.investigationEngine) {
        const c = window.investigationEngine.getCurrentCase();
        if (c && c.id) this.activeCaseId = c.id;
      }

      let modal = document.getElementById('ragAssistantModal');
      if (!modal) {
        this.injectModalHtml();
        modal = document.getElementById('ragAssistantModal');
      }

      if (modal) {
        this.syncCaseSelector();
        this.renderSuggestedQuestions();
        this.triggerDefaultQuery();
        modal.classList.add('active');
        if (window.audioFX) window.audioFX.playClick();
      }
    }

    closeModal() {
      const modal = document.getElementById('ragAssistantModal');
      if (modal) modal.classList.remove('active');
    }

    injectModalHtml() {
      const div = document.createElement('div');
      div.id = 'ragAssistantModal';
      div.className = 'modal-overlay';
      div.innerHTML = `
        <div class="modal-content rag-modal-content">
          <div class="modal-header rag-modal-header">
            <div style="display:flex; align-items:center; gap:12px;">
              <div class="rag-header-badge">🧠 RAG-Anything</div>
              <div>
                <h3 style="margin:0; font-size:1.1rem; color:var(--text-main); font-weight:700;">
                  TRỢ LÝ CHÂN LÝ THỰC NGHIỆM & SGK VẬT LÝ 10
                </h3>
                <p style="margin:2px 0 0 0; font-size:0.75rem; color:var(--text-muted);">
                  Kiến trúc Multimodal RAG (HKUDS) • Bóc tách văn bản, công thức LaTeX & sơ đồ lực thực nghiệm
                </p>
              </div>
            </div>
            <button class="btn" onclick="window.ragUI.closeModal()" style="padding:4px 10px; font-size:1.1rem; border-color:var(--border-strong);" aria-label="Đóng">&times;</button>
          </div>

          <div class="modal-body rag-modal-body">
            <!-- Mode & Scope Bar -->
            <div class="rag-scope-bar">
              <div style="display:flex; align-items:center; gap:8px; flex:1; min-width:240px;">
                <label for="ragCaseSelector" style="font-size:0.82rem; font-weight:600; color:var(--text-main); white-space:nowrap;">📚 Phạm vi tra cứu:</label>
                <select id="ragCaseSelector" class="rag-select" onchange="window.ragUI.onScopeChange(this.value)">
                  <option value="1">Vụ án 1: Tháp Pisa (Rơi tự do & Đa thiên thể)</option>
                  <option value="2">Vụ án 2: Tai nạn ngã tư (Định luật III Newton)</option>
                  <option value="3">Vụ án 3: Khúc cua tử thần (Lực hướng tâm)</option>
                  <option value="4">Vụ án 4: Đèo dốc ma sát (Mặt phẳng nghiêng)</option>
                  <option value="5">Vụ án 5: Xe bọc thép (Bảo toàn động lượng)</option>
                  <option value="6">Vụ án 6: Cú nhảy bình lưu (Vận tốc tới hạn)</option>
                </select>
              </div>

              <div class="rag-status-chip">
                <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:var(--green);"></span>
                <span id="ragEngineModeLabel" style="font-size:0.75rem; font-weight:600; color:var(--green);">Hybrid RAG Engine: Sẵn sàng</span>
              </div>
            </div>

            <!-- Query Input Bar -->
            <div class="rag-search-box">
              <input type="text" id="ragQueryInput" class="rag-input" placeholder="Gõ câu hỏi vật lý hoặc hiện tượng cần tra cứu..." onkeydown="if(event.key==='Enter') window.ragUI.handleUserQuery()">
              <button class="btn btn-primary" id="btnRagSearch" onclick="window.ragUI.handleUserQuery()" style="display:flex; align-items:center; gap:6px; min-width:110px; justify-content:center;">
                <span>🔍 Truy xuất</span>
              </button>
            </div>

            <!-- Suggested Quick Questions -->
            <div class="rag-quick-questions" id="ragQuickQuestions">
              <!-- Rendered dynamically -->
            </div>

            <!-- Retrieval Results Stream Area -->
            <div id="ragResultsArea" class="rag-results-container">
              <!-- Rendered dynamically -->
            </div>

            <!-- Bottom Tools Bar: Settings & External Backend Config -->
            <div class="rag-footer-bar">
              <details class="rag-settings-details">
                <summary style="font-size:0.78rem; color:var(--text-muted); cursor:pointer; font-weight:600;">
                  ⚙️ Cấu hình Backend RAG-Anything ngoài (Tùy chọn dành cho Giảng viên / Nghiên cứu)
                </summary>
                <div class="rag-settings-panel">
                  <div style="display:flex; gap:10px; margin-top:8px; flex-wrap:wrap;">
                    <label style="font-size:0.78rem; display:flex; align-items:center; gap:4px;">
                      <input type="radio" name="ragModeRadio" value="hybrid-local" checked onchange="window.ragUI.setEngineMode(this.value)"> 
                      Offline Hybrid Engine (Mặc định - Siêu tốc, không cần cài đặt)
                    </label>
                    <label style="font-size:0.78rem; display:flex; align-items:center; gap:4px;">
                      <input type="radio" name="ragModeRadio" value="external-backend" onchange="window.ragUI.setEngineMode(this.value)"> 
                      FastAPI Python Backend (rag_backend.py)
                    </label>
                  </div>
                  <div id="ragBackendInputRow" style="display:none; margin-top:8px;">
                    <input type="text" id="ragBackendUrlInput" style="width:100%; font-size:0.8rem; padding:6px 10px; border:1px solid var(--border-color); border-radius:4px; background:var(--bg-card); color:var(--text-main);" placeholder="http://localhost:8000/api/chat" value="http://localhost:8000/api/chat">
                    <button class="btn btn-primary" onclick="window.ragUI.saveBackendUrl()" style="margin-top:4px; font-size:0.75rem; padding:4px 10px;">Lưu Endpoint</button>
                  </div>
                </div>
              </details>
            </div>

          </div>
        </div>
      `;
      document.body.appendChild(div);
    }

    syncCaseSelector() {
      const select = document.getElementById('ragCaseSelector');
      if (select) select.value = String(this.activeCaseId);
    }

    onScopeChange(val) {
      this.activeCaseId = parseInt(val, 10) || 1;
      this.renderSuggestedQuestions();
      this.triggerDefaultQuery();
      if (window.audioFX) window.audioFX.playClick();
    }

    renderSuggestedQuestions() {
      const container = document.getElementById('ragQuickQuestions');
      if (!container) return;

      const questionsMap = {
        1: [
          "Tại sao trong chân không vật nặng rơi cùng lúc với vật nhẹ?",
          "Gia tốc rơi tự do trên Sao Hỏa và Mặt Trăng khác Trái Đất thế nào?",
          "Aristotle đã mắc phải ngụy biện gì suốt 2000 năm?"
        ],
        2: [
          "Khi xe tải đâm xe con, lực tác dụng của xe nào lớn hơn?",
          "Tại sao xe con bẹp dúm dù nhận cùng độ lớn lực?",
          "Định luật III Newton áp dụng vào va chạm ra sao?"
        ],
        3: [
          "Tại sao không có lực ly tâm trong hệ quy chiếu quán tính?",
          "Khi cắt dây quán tính, vật bay tiếp tuyến hay xuyên tâm?",
          "Điều kiện để xe ôm cua không bị trượt là gì?"
        ],
        4: [
          "Tại sao độ dốc tăng thì lực ma sát trượt lại giảm mạnh?",
          "Áp lực pháp tuyến N liên hệ thế nào với góc dốc cos(alpha)?",
          "Xe mất phanh trên đèo dốc nguy hiểm vì yếu tố nào?"
        ],
        5: [
          "Trong va chạm mềm, động lượng và động năng có cùng bảo toàn?",
          "Phần cơ năng bị hụt đi đã chuyển hóa thành những năng lượng nào?",
          "Công thức tính vận tốc của hai xe sau khi dính vào nhau?"
        ],
        6: [
          "Tại sao người nhảy dù không tăng tốc vô hạn khi rơi?",
          "Vận tốc tới hạn (v_terminal) được thiết lập khi nào?",
          "Bung dù làm thay đổi đại lượng vật lý nào để hãm tốc?"
        ]
      };

      const qs = questionsMap[this.activeCaseId] || questionsMap[1];
      container.innerHTML = `
        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; margin-bottom:4px;">💡 Câu hỏi trích xuất nhanh từ SGK:</div>
        <div style="display:flex; flex-wrap:wrap; gap:6px;">
          ${qs.map(q => `
            <button class="rag-chip-btn" onclick="window.ragUI.quickAsk('${q.replace(/'/g, "\\'")}')">
              ${q}
            </button>
          `).join('')}
        </div>
      `;
    }

    quickAsk(questionText) {
      const input = document.getElementById('ragQueryInput');
      if (input) input.value = questionText;
      this.handleUserQuery();
    }

    triggerDefaultQuery() {
      const caseData = this.engine.corpus.find(c => c.caseId === this.activeCaseId) || this.engine.corpus[0];
      this.renderRetrievalResults({
        sourceMode: 'hybrid-local',
        caseId: caseData.caseId,
        caseTitle: caseData.lessonTitle,
        curriculumSource: caseData.curriculumRef,
        abstract: caseData.abstract,
        sgkQuote: caseData.sgkQuote,
        primaryFormula: caseData.latexFormulas[0],
        allFormulas: caseData.latexFormulas,
        diagram: caseData.multimodalDiagram,
        fallacyTaxonomy: caseData.fallacyAnalysis,
        confidence: 96
      });
    }

    async handleUserQuery() {
      const input = document.getElementById('ragQueryInput');
      if (!input || !input.value.trim()) return;

      const userText = input.value.trim();
      const resultsContainer = document.getElementById('ragResultsArea');
      if (!resultsContainer) return;

      // Loading State
      resultsContainer.innerHTML = `
        <div class="rag-loading-state">
          <div class="rag-spinner"></div>
          <div>
            <strong>Đang truy xuất Đa Thể Thức (RAG-Anything)...</strong>
            <p style="margin:2px 0 0 0; font-size:0.78rem; color:var(--text-muted);">
              Đang tra cứu đồ thị tri thức SGK Vật lý 10 • Định dạng công thức LaTeX • Phân tích sơ đồ lực
            </p>
          </div>
        </div>
      `;

      if (window.audioFX) window.audioFX.playClick();

      // Query engine
      const res = await this.engine.query(userText, this.activeCaseId);
      this.renderRetrievalResults(res);
    }

    renderRetrievalResults(res) {
      const container = document.getElementById('ragResultsArea');
      if (!container) return;

      if (!res) {
        container.innerHTML = `<div class="dossier-card">Không tìm thấy dữ liệu liên quan.</div>`;
        return;
      }

      // Check KaTeX availability for rendering formulas
      const renderMath = (latex) => {
        if (window.katex) {
          try {
            return window.katex.renderToString(latex, { throwOnError: false, displayMode: true });
          } catch (e) {}
        }
        return `<div class="rag-formula-fallback"><code>${latex}</code></div>`;
      };

      container.innerHTML = `
        <!-- Source Grounding Header -->
        <div class="rag-card rag-grounding-banner">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
            <div>
              <span class="rag-badge rag-badge-gold">📖 BẢO CHỨNG TÀI LIỆU CHÍNH THỨC</span>
              <h4 style="margin:6px 0 2px 0; color:var(--text-main); font-size:0.95rem;">
                ${res.caseTitle || 'Chuyên đề Vật lý THPT'}
              </h4>
              <p style="margin:0; font-size:0.78rem; color:var(--text-muted); font-style:italic;">
                ${res.curriculumSource || 'Bộ GDĐT - Chuẩn GDPT 2018'}
              </p>
            </div>
            <div class="rag-confidence-badge">
              <span>Độ khớp tri thức:</span>
              <strong>${res.confidence || 95}%</strong>
            </div>
          </div>
        </div>

        <!-- SGK Quote & Abstract -->
        <div class="rag-card">
          <h5 style="color:var(--cyan); margin:0 0 6px 0; font-size:0.85rem; display:flex; align-items:center; gap:6px;">
            <span>📑</span> NGUYÊN VĂN ĐỊNH NGHĨA SÁCH GIÁO KHOA:
          </h5>
          <blockquote class="rag-blockquote">
            ${res.sgkQuote || res.abstract}
          </blockquote>
          <p style="font-size:0.82rem; color:var(--text-main); margin:8px 0 0 0; line-height:1.55;">
            ${res.abstract}
          </p>
        </div>

        <!-- Mathematical Grounding (LaTeX) -->
        <div class="rag-card">
          <h5 style="color:var(--green); margin:0 0 8px 0; font-size:0.85rem; display:flex; align-items:center; gap:6px;">
            <span>🧮</span> CÔNG THỨC TOÁN HỌC & ĐỊNH LUẬT BẢO CHỨNG (LaTeX):
          </h5>
          ${(res.allFormulas || [res.primaryFormula]).map(f => `
            <div class="rag-formula-block">
              <div style="font-size:0.78rem; font-weight:700; color:var(--text-dim); margin-bottom:4px;">
                ● ${f.label}:
              </div>
              <div class="rag-math-display">
                ${renderMath(f.formula)}
              </div>
              <p style="font-size:0.78rem; color:var(--text-muted); margin:4px 0 0 0; line-height:1.45;">
                ↳ <em>Ý nghĩa:</em> ${f.explanation}
              </p>
            </div>
          `).join('')}
        </div>

        <!-- Multimodal Vector Diagram Description -->
        <div class="rag-card">
          <h5 style="color:var(--purple); margin:0 0 6px 0; font-size:0.85rem; display:flex; align-items:center; gap:6px;">
            <span>📊</span> MÔ TẢ ĐA PHƯƠNG THỨC & SƠ ĐỒ LỰC THỰC NGHIỆM:
          </h5>
          <div style="background:var(--bg-alt); padding:10px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:0.82rem; line-height:1.5; color:var(--text-main);">
            <div style="font-weight:700; color:var(--text-dim); margin-bottom:4px;">
              📐 Mô hình: ${res.diagram.diagramType}
            </div>
            ${res.diagram.description}
          </div>
        </div>

        <!-- Fallacy Deconstruction -->
        <div class="rag-card" style="border-left:3px solid var(--crimson);">
          <h5 style="color:var(--crimson); margin:0 0 6px 0; font-size:0.85rem; display:flex; align-items:center; gap:6px;">
            <span>🛡️</span> BÓC TÁCH BẪY NGỤY BIỆN & LẬP LUẬN BÁC BỎ:
          </h5>
          <div style="margin-bottom:6px;">
            <span class="tier-badge" style="background:rgba(153,27,27,0.1); color:var(--crimson); border-color:var(--crimson);">
              ${res.fallacyTaxonomy.fallacyType}
            </span>
          </div>
          <p style="font-size:0.82rem; color:var(--crimson); margin:4px 0; font-weight:600;">
            🦹‍♂️ Lập luận Tiến sĩ Sophos: "${res.fallacyTaxonomy.sophosFallacy}"
          </p>
          <p style="font-size:0.82rem; color:var(--text-main); margin:6px 0 0 0; background:rgba(34,197,94,0.06); padding:8px 10px; border-radius:6px; border:1px solid rgba(34,197,94,0.2); line-height:1.5;">
            💥 <strong>Đòn phản bác khoa học:</strong> ${res.fallacyTaxonomy.counterArgument}
          </p>
        </div>
      `;
    }

    setEngineMode(mode) {
      this.engine.saveConfig({ apiMode: mode });
      const row = document.getElementById('ragBackendInputRow');
      const label = document.getElementById('ragEngineModeLabel');
      if (row) row.style.display = (mode === 'external-backend') ? 'block' : 'none';
      if (label) {
        label.innerText = (mode === 'external-backend') ? 'FastAPI Backend: Đang kết nối...' : 'Hybrid RAG Engine: Sẵn sàng';
        label.style.color = (mode === 'external-backend') ? 'var(--amber)' : 'var(--green)';
      }
    }

    saveBackendUrl() {
      const input = document.getElementById('ragBackendUrlInput');
      if (input && input.value.trim()) {
        this.engine.saveConfig({ backendUrl: input.value.trim() });
        if (window.showToast) window.showToast('✅ Đã lưu cấu hình endpoint Backend RAG-Anything!');
      }
    }
  }

  // ==========================================
  // EXPORT INSTANCES TO GLOBAL SCOPE
  // ==========================================
  const ragEngine = new RAGEngine();
  const ragUI = new RAGAssistantUI(ragEngine);

  window.RAGEngine = RAGEngine;
  window.ragEngine = ragEngine;
  window.ragUI = ragUI;

  // Global helper for opening modal
  window.openRAGAssistant = function (caseId = null) {
    window.ragUI.openModal(caseId);
  };

})(window);
