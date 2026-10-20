/* ========================================
   2026 2학년 같이 UP, 가치 UP!
   SPORTS FESTIVAL
======================================== */

document.addEventListener("DOMContentLoaded", function () {
  /* =========================
     Supabase 연결 설정
  ========================= */

  const SUPABASE_URL = "https://tdrebwaendjrwqcfforx.supabase.co";
  const SUPABASE_KEY = "sb_publishable_Y3k600Ij5iIlOFK8CNKhJg_WLevWGFo";

  async function loadFestivalResults() {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/festival_results?select=*`,
        {
          headers: {
            apikey: SUPABASE_KEY
          }
        }
      );

      if (!response.ok) {
        throw new Error(`조회 실패: ${response.status}`);
      }

      const results = await response.json();
      console.log("Supabase 경기 결과:", results);
       renderMissionLiveRanking(results);
       renderRopeLiveRanking(results);
       renderThreeLeggedLiveRanking(results);
       renderDodgeballLiveResults(results);

    } catch (error) {
      console.error("경기 결과 불러오기 오류:", error);
    }
  }
  /* =========================
     1. 하단 메뉴 화면 전환
  ========================= */

   function renderThreeLeggedLiveRanking(results) {
  const container = document.getElementById("threeLeggedLiveRanking");
  if (!container) return;

  const threeLeggedRecords = results.filter(record =>
    record.sport === "threeLegged"
  );

  if (threeLeggedRecords.length === 0) {
    container.textContent = "아직 입력된 경기 기록이 없습니다.";
    return;
  }
        const classRecords = threeLeggedRecords
    .filter(record =>
      Number.isInteger(Number(record.class_number)) &&
      Number(record.class_number) >= 1 &&
      Number(record.class_number) <= 9 &&
      record.match_id === `class_${record.class_number}` &&
      Number.isFinite(Number(record.result_value)) &&
      Number(record.result_value) > 0
    )
    .map(record => ({
      classNum: Number(record.class_number),
      time: Number(record.result_value)
    }))
    .sort((a, b) => a.time - b.time);
        const scores = [120, 110, 100, 90, 80, 70, 60, 50, 40];

  let rank = 0;
  let previousTime = null;

  const ranking = classRecords.map(record => {
    if (previousTime === null || record.time !== previousTime) {
      rank++;
    }

    previousTime = record.time;

    return {
      classNum: record.classNum,
      time: record.time,
      rank,
      score: scores[rank - 1]
    };
  });
        if (ranking.length === 0) {
    container.textContent = "아직 입력된 경기 기록이 없습니다.";
    return;
  }

  container.innerHTML = `
    <p style="font-size:13px;color:#697386;">
      기록 입력 현황: ${ranking.length}/9학급
    </p>

    <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;text-align:center;">
        <thead>
          <tr>
            <th>순위</th>
            <th>학급</th>
            <th>기록</th>
            <th>점수</th>
          </tr>
        </thead>
        <tbody>
          ${ranking.map(row => `
            <tr>
              <td>${row.rank}위</td>
              <td>${row.classNum}반</td>
              <td>${row.time.toFixed(2)}초</td>
              <td>${row.score}점</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}
   function renderDodgeballLiveResults(results) {
  const container = document.getElementById("dodgeballLiveResults");
  if (!container) return;
        const dodgeballRecords = results.filter(record =>
    record.sport === "dodgeball" &&
    record.winner_class !== null &&
    Number.isInteger(Number(record.winner_class)) &&
    Number(record.winner_class) >= 1 &&
    Number(record.winner_class) <= 9
  );
       if (dodgeballRecords.length === 0) {
    container.textContent = "아직 입력된 피구 경기 결과가 없습니다.";
    return;
  } 
      dodgeballRecords.sort((a, b) => Number(a.match_id) - Number(b.match_id));
        container.innerHTML = dodgeballRecords.map(record => `
    <div style="padding:10px; border-bottom:1px solid #ddd;">
      <strong>${record.match_id}경기</strong>
      <span>🏆 ${record.winner_class}반 승리</span>
    </div>
  `).join("");
}
   function renderRopeLiveRanking(results) {
  const container = document.getElementById("ropeLiveRanking");
  if (!container) return;

  const ropeRecords = results.filter(record =>
    record.sport === "rope"
  );

  if (ropeRecords.length === 0) {
    container.textContent = "아직 입력된 경기 기록이 없습니다.";
    return;
  }
        const classRecords = [];

  for (let classNum = 1; classNum <= 9; classNum++) {
    const attempts = ropeRecords.filter(record =>
      record.class_number === classNum &&
      ["class_" + classNum + "_attempt_1", "class_" + classNum + "_attempt_2"].includes(record.match_id)
    );

    const validAttempts = attempts
      .map(record => Number(record.result_value))
      .filter(value => Number.isFinite(value) && value >= 0);

    if (validAttempts.length > 0) {
      classRecords.push({
        classNum,
        best: Math.max(...validAttempts)
      });
    }
  }

  classRecords.sort((a, b) => b.best - a.best);
        const scores = [120, 110, 100, 90, 80, 70, 60, 50, 40];

  let rank = 0;
  let previousBest = null;

  const ranking = classRecords.map(record => {
    if (previousBest === null || record.best !== previousBest) {
      rank++;
    }

    previousBest = record.best;

    return {
      classNum: record.classNum,
      best: record.best,
      rank,
      score: scores[rank - 1]
    };
  });
        if (ranking.length === 0) {
    container.textContent = "아직 입력된 경기 기록이 없습니다.";
    return;
  }

  container.innerHTML = `
    <p style="font-size:13px;color:#697386;">
      기록 입력 현황: ${ranking.length}/9학급
    </p>
    <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;text-align:center;">
        <thead>
          <tr>
            <th>순위</th>
            <th>학급</th>
            <th>최고 기록</th>
            <th>점수</th>
          </tr>
        </thead>
        <tbody>
          ${ranking.map(row => `
            <tr>
              <td>${row.rank}위</td>
              <td>${row.classNum}반</td>
              <td>${row.best}회</td>
              <td>${row.score}점</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}
   function renderMissionLiveRanking(results) {
  const container = document.getElementById("missionLiveRanking");
  if (!container) return;

  const missionRecords = results.filter(record =>
    record.sport === "mission"
  );

  const teacherRecord = missionRecords.find(record =>
    record.match_id === "teacher_team"
  );

  const teacherTime = teacherRecord
    ? Number(teacherRecord.result_value)
    : null;

  const classRecords = missionRecords
    .filter(record =>
      record.match_id === `class_${record.class_number}` &&
      Number(record.result_value) > 0
    )
    .sort((a, b) =>
      Number(a.result_value) - Number(b.result_value)
    );
        const scores = [120, 110, 100, 90, 80, 70, 60, 50, 40];

  let rank = 0;
  let previousTime = null;

  const ranking = classRecords.map(record => {
    const time = Number(record.result_value);

    if (previousTime === null || time !== previousTime) {
      rank++;
    }

    previousTime = time;

    const bonus = teacherTime !== null && time < teacherTime;

    return {
      classNum: Number(record.class_number),
      time,
      rank,
      bonus,
      score: scores[rank - 1] + (bonus ? 30 : 0)
    };
  });
        if (ranking.length === 0) {
    container.textContent = "아직 입력된 경기 기록이 없습니다.";
    return;
  }

  container.innerHTML = `
    <p style="font-size:13px;color:#697386;">
      기록 입력 현황: ${ranking.length}/9학급
    </p>

    <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;text-align:center;">
        <thead>
          <tr>
            <th>순위</th>
            <th>학급</th>
            <th>기록</th>
            <th>점수</th>
          </tr>
        </thead>
        <tbody>
          ${ranking.map(row => `
            <tr>
              <td>${row.rank}위</td>
              <td>${row.classNum}반</td>
              <td>${row.time.toFixed(2)}초</td>
              <td>
                ${row.score}점
                ${row.bonus ? "🏅 보너스 점수 획득!" : ""}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}
  const navItems = document.querySelectorAll(".nav-item");
  const pages = document.querySelectorAll(".page");

  navItems.forEach(item => {
    item.addEventListener("click", function () {

      const target = this.dataset.page;

      if (!target) return;

      // 모든 화면 숨기기
      pages.forEach(page => {
        page.classList.remove("active");
      });

      // 모든 메뉴 선택 해제
      navItems.forEach(nav => {
        nav.classList.remove("active");
      });

      // 선택한 화면 표시
      const targetPage = document.getElementById(target);

      if (targetPage) {
        targetPage.classList.add("active");
      }

      // 선택한 메뉴 강조
      this.classList.add("active");

      // 화면 위쪽으로 이동
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });
  });


  /* =========================
     2. 경기요강 종목 선택
  ========================= */

  const sportButtons = document.querySelectorAll(".sport-btn");
  const ruleContents = document.querySelectorAll(".rule-content");

  sportButtons.forEach(button => {

    button.addEventListener("click", function () {

      const sport = this.dataset.sport;

      sportButtons.forEach(btn => {
        btn.classList.remove("active");
      });

      ruleContents.forEach(content => {
        content.style.display = "none";
      });

      this.classList.add("active");

      const selectedRule =
        document.getElementById("rule-" + sport);

      if (selectedRule) {
        selectedRule.style.display = "block";
      }

    });

  });


  /* =========================
     3. 학급 점수 데이터
     나중에 Supabase와 연결 예정
  ========================= */

  const classScores = [

    {
      className: "1반",
      dodgeball: 0,
      mission: 0,
      rope: 0,
      tug: 0,
      threeLegged: 0
    },

    {
      className: "2반",
      dodgeball: 0,
      mission: 0,
      rope: 0,
      tug: 0,
      threeLegged: 0
    },

    {
      className: "3반",
      dodgeball: 0,
      mission: 0,
      rope: 0,
      tug: 0,
      threeLegged: 0
    },

    {
      className: "4반",
      dodgeball: 0,
      mission: 0,
      rope: 0,
      tug: 0,
      threeLegged: 0
    },

    {
      className: "5반",
      dodgeball: 0,
      mission: 0,
      rope: 0,
      tug: 0,
      threeLegged: 0
    },

    {
      className: "6반",
      dodgeball: 0,
      mission: 0,
      rope: 0,
      tug: 0,
      threeLegged: 0
    },

    {
      className: "7반",
      dodgeball: 0,
      mission: 0,
      rope: 0,
      tug: 0,
      threeLegged: 0
    },

    {
      className: "8반",
      dodgeball: 0,
      mission: 0,
      rope: 0,
      tug: 0,
      threeLegged: 0
    },

    {
      className: "9반",
      dodgeball: 0,
      mission: 0,
      rope: 0,
      tug: 0,
      threeLegged: 0
    }

  ];


  /* =========================
     4. 총점 계산
  ========================= */

  function calculateScores() {

    classScores.forEach(team => {

      team.total =
        team.dodgeball +
        team.mission +
        team.rope +
        team.tug +
        team.threeLegged;

    });

  }


  /* =========================
     5. 종합 순위 계산
  ========================= */

  function calculateRanking() {

    calculateScores();

    const ranking = [...classScores];

    ranking.sort((a, b) => {

      // 1차 : 총점
      if (b.total !== a.total) {
        return b.total - a.total;
      }

      /*
        계획서 동점 처리 기준

        1. 8자 줄넘기
        2. 2인 3각
        3. 미션달리기
        4. 줄다리기
        5. 피구
      */

      if (b.rope !== a.rope) {
        return b.rope - a.rope;
      }

      if (b.threeLegged !== a.threeLegged) {
        return b.threeLegged - a.threeLegged;
      }

      if (b.mission !== a.mission) {
        return b.mission - a.mission;
      }

      if (b.tug !== a.tug) {
        return b.tug - a.tug;
      }

      return b.dodgeball - a.dodgeball;

    });

    return ranking;

  }


  /* =========================
     6. 점수표 출력
  ========================= */

  function renderScoreTable() {

    const tbody =
      document.getElementById("score-body");

    if (!tbody) return;

    const ranking = calculateRanking();

    tbody.innerHTML = "";

    ranking.forEach((team, index) => {

      const row =
        document.createElement("tr");

      row.innerHTML = `
        <td class="rank-number">
          ${index + 1}
        </td>

        <td>
          <strong>${team.className}</strong>
        </td>

        <td>${team.dodgeball}</td>

        <td>${team.mission}</td>

        <td>${team.rope}</td>

        <td>${team.tug}</td>

        <td>${team.threeLegged}</td>

        <td class="total-score">
          ${team.total}
        </td>
      `;

      tbody.appendChild(row);

    });

  }


  /* =========================
     7. 홈 TOP3 출력
  ========================= */

  function renderTop3() {

    const ranking = calculateRanking();

    const first =
      document.getElementById("rank-1");

    const second =
      document.getElementById("rank-2");

    const third =
      document.getElementById("rank-3");


    /*
      아직 모든 점수가 0점이면
      순위를 표시하지 않음
    */

    const hasScore =
      ranking.some(team => team.total > 0);

    if (!hasScore) {

      if (first) {
        first.innerHTML =
          `<strong>-</strong>
           <small>집계 전</small>`;
      }

      if (second) {
        second.innerHTML =
          `<strong>-</strong>
           <small>집계 전</small>`;
      }

      if (third) {
        third.innerHTML =
          `<strong>-</strong>
           <small>집계 전</small>`;
      }

      return;
    }


    if (first) {
      first.innerHTML =
        `<strong>${ranking[0].className}</strong>
         <small>${ranking[0].total}점</small>`;
    }

    if (second) {
      second.innerHTML =
        `<strong>${ranking[1].className}</strong>
         <small>${ranking[1].total}점</small>`;
    }

    if (third) {
      third.innerHTML =
        `<strong>${ranking[2].className}</strong>
         <small>${ranking[2].total}점</small>`;
    }

  }


  /* =========================
     최초 실행
  ========================= */

  renderScoreTable();
  renderTop3();
  loadFestivalResults();
});
