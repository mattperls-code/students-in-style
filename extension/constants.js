export const constants = {

 covidHtml = `
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

` };
