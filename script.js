/* ========================================
   2026 2학년 같이 UP, 가치 UP!
   SPORTS FESTIVAL
======================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* =========================
     1. 하단 메뉴 화면 전환
  ========================= */

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

});
