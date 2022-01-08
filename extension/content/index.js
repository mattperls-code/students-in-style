let sentMessage1 = false;
let sentMessage2 = false;
let sentMessage3 = false;

const constants = {
  covidHtml: `
   <script>
   const covidURL = "https://disease.sh/v3/covid-19/nyt/counties/Philadelphia?lastdays=14";
   
   fetch(covidURL)
   .then((data) => data.json())
   .then((res) => {
   const covidPanel = document.querySelector(".covid-panel");
   console.log(res);
   const cases = document.querySelector(
   ".covid-panel__container--right--cases"
   );
   const deaths = document.querySelector(
   ".covid-panel__container--right--deaths"
   );
   const recovered = document.querySelector(
   ".covid-panel__container--right--recovered"
   );
   
   const lastDay = res[res.length - 1];
   cases.innerHTML = \`<h3>\${lastDay.cases}</h3>\`;
   deaths.innerHTML = \`<h3>\${lastDay.deaths}</h3>\`;
   recovered.innerHTML = \`<h3>\${lastDay.recovered}</h3>\`;
   })
   .catch((err) => {
   console.log(err);
   });
   </script>
   
   <div class="covid-panel">
   <div class="covid-panel__container">
   <div class="covid-panel__container--left">
   <div class="covid-panel__container--left--title">
   <h1>COVID-19</h1>
   </div>
   <div class="covid-panel__container--left--subtitle">
   <h2>Philadelphia</h2>
   </div>
   <div class="covid-panel__container--left--cases">
   <h3>Cases</h3>
   </div>
   <div class="covid-panel__container--left--deaths">
   <h3>Deaths</h3>
   </div>
   <div class="covid-panel__container--left--recovered">
   <h3>Recovered</h3>
   </div>
   </div>
   <div class="covid-panel__container--right">
   <div class="covid-panel__container--right--cases">
   <h3>0</h3>
   </div>
   <div class="covid-panel__container--right--deaths">
   <h3>0</h3>
   </div>
   <div class="covid-panel__container--right--recovered">
   <h3>0</h3>
   </div>
   </div>
   <h5>
   <a href="https://disease.sh/">Data Source: New York Times </a>
   </h5>
   </div>
   </div>
   `,
  septaHtml: `
   
   `,
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.message == "sis-urlchange") {
    if (
      window.location.href.startsWith(
        "https://philasd.infinitecampus.org/campus/nav-wrapper/student/portal/student/"
      )
    ) {
      if (!sentMessage1) {
        console.log(
          "%cYou been haczd",
          "font-size: 24px; color: rgb(220, 220, 220); margin-top: 12px; margin-bottom: 8px;"
        );
        console.log(
          "%cJK, have fun with the new styles",
          "font-size: 16px; color: rgb(200, 200, 200); margin-top: 8px; margin-bottom: 24px;"
        );
        sentMessage1 = true;
      }
      try {
        const logoContainer = document.querySelector(".header__logo");
        if (logoContainer == null) {
          throw new Error("doesnt exist yet");
        }
        const url = "https://logo-api-i9jpe.ondigitalocean.app";
        fetch(url)
          .then((res) => res.json())
          .then((res) => {
            const logoSrc = res.data;
            const sisLogo = document.createElement("img");
            sisLogo.src = logoSrc;
            (sisLogo.alt = "Students In Style"),
              (sisLogo.className = "sisLogo");
            logoContainer.appendChild(sisLogo);
          });

        const headerElement = document.querySelector(".header");
        const sideBarHeader = document.querySelector(".sidebar__header");
        if (headerElement == null) {
          throw new Error("doesnt exist yet");
        }
        chrome.storage.sync.get(["sis-color"], (result) => {
          if (typeof result["sis-color"] == "string") {
            headerElement.style.backgroundColor = `hsl(${result["sis-color"]}, 100%, 55%)`;
            sideBarHeader.style.backgroundColor = `hsl(${result["sis-color"]}, 100%, 55%)`;
            const icons = document.getElementsByClassName("fa");
            for (let i = 0; i < icons.length; i++) {
              icons.item(
                i
              ).style.color = `hsl(${result["sis-color"]}, 100%, 10%)`;
            }
            const activeTabMarkers = document.getElementsByClassName("tool");
            for (let i = 0; i < activeTabMarkers.length; i++) {
              activeTabMarkers.item(
                i
              ).style.borderColor = `hsl(${result["sis-color"]}, 100%, 55%)`;
            }
          }
        });
      } catch (e) {
        if (!sentMessage2) {
          console.log("just give it a minute");
          sentMessage2 = true;
        }
      }
    }
    if (
      window.location.href ==
      "https://philasd.infinitecampus.org/campus/nav-wrapper/student/portal/student/today"
    ) {
      const setPage = (callback) => {
        let successful = true;
        try {
          const iframeElement = document.querySelector("#main-workspace");
          const pfpElement = iframeElement.contentDocument.querySelector(
            ".today__student-picture"
          ).firstChild;
          const nameElement = iframeElement.contentDocument.querySelector(
            ".today__student-name"
          );
          chrome.storage.sync.get(["sis-pfp"], (result) => {
            if (
              typeof result["sis-pfp"] == "string" &&
              result["sis-pfp"] != ""
            ) {
              pfpElement.setAttribute("src", result["sis-pfp"]);
            }
          });
          chrome.storage.sync.get(["sis-name"], (result) => {
            if (
              typeof result["sis-name"] == "string" &&
              result["sis-name"] != ""
            ) {
              nameElement.innerHTML = result["sis-name"];
            }
          });
          // ! code for COVID-19 tracker and Septa schedule !
          const contentSpace =
            iframeElement.contentDocument.querySelector(".contentSpace");
          const widgetContainer = contentSpace.children[0][0];

          const covidWidget =
            iframeElement.contentDocument.createElement("div");
          covidWidget.innerHTML = constants.covidHtml;
          widgetContainer.appendChild(covidWidget);
        } catch (e) {
          if (!sentMessage3) {
            console.log("try getting some wifi bruh");
            sentMessage3 = true;
          }
          successful = false;
        }
        callback(successful);
      };

      const setUntilSuccessful = (successful) => {
        if (!successful) {
          setTimeout(() => {
            setPage(setUntilSuccessful);
          }, 100);
        }
      };
      setUntilSuccessful(false);
    }
  }
});
