import type { PortalApp } from "../portal/registry";
import { layout } from "../portal/layout";

function renderMafScript(): string {
  return `
(function () {
  var YOUTH_CEILING = 165;
  var YOUTH_AGE_MAX = 16;
  var SENIOR_AGE_MIN = 65;

  function computeMaf(age, modifier) {
    if (age <= YOUTH_AGE_MAX) {
      return {
        ceiling: YOUTH_CEILING,
        zoneLow: YOUTH_CEILING - 10,
        zoneHigh: YOUTH_CEILING,
        note: "Athletes 16 and under should use a fixed 165 bpm ceiling instead of the 180 − age formula."
      };
    }
    var ceiling = 180 - age + modifier;
    var note = age >= SENIOR_AGE_MIN
      ? "Athletes over ~65 may need further individualized adjustment (up to +10 bpm with appropriate medical supervision per Maffetone)."
      : null;
    return { ceiling: ceiling, zoneLow: ceiling - 10, zoneHigh: ceiling, note: note };
  }

  var ageInput = document.getElementById("age");
  var modifierInputs = document.querySelectorAll('input[name="modifier"]');
  var ceilingEl = document.getElementById("maf-ceiling");
  var zoneEl = document.getElementById("maf-zone");
  var notesEl = document.getElementById("maf-notes");

  function getModifier() {
    var selected = document.querySelector('input[name="modifier"]:checked');
    return selected ? parseInt(selected.value, 10) : 0;
  }

  function update() {
    var age = parseInt(ageInput.value, 10);
    if (isNaN(age) || age < 1 || age > 120) {
      ceilingEl.textContent = "—";
      zoneEl.textContent = "Enter a valid age (1–120)";
      notesEl.innerHTML = "";
      return;
    }
    var result = computeMaf(age, getModifier());
    ceilingEl.textContent = result.ceiling + " bpm";
    zoneEl.textContent = result.zoneLow + " – " + result.zoneHigh + " bpm";
    notesEl.innerHTML = result.note ? "<p>" + result.note + "</p>" : "";
  }

  ageInput.addEventListener("input", update);
  modifierInputs.forEach(function (el) {
    el.addEventListener("change", update);
  });
  update();
})();
`.trim();
}

export const maffetoneApp: PortalApp = {
  slug: "maffetone",
  name: "MAF 180 Calculator",
  description:
    "Calculate your maximum aerobic function heart rate using the Maffetone 180 Formula.",

  render(_req: Request): Response {
    const body = `
      <h1>MAF 180 Calculator</h1>
      <p class="muted">
        The Maffetone Method uses a heart-rate ceiling to build aerobic fitness while
        minimizing stress and injury. Your MAF heart rate is the highest rate at which you
        can train while staying primarily in the aerobic zone.
      </p>

      <form id="maf-form" onsubmit="return false;">
        <div class="form-group">
          <label for="age">Age</label>
          <input type="number" id="age" name="age" min="1" max="120" value="40" required>
        </div>

        <div class="form-group">
          <label>Training &amp; health modifier</label>
          <div class="radio-group">
            <label class="radio-option">
              <input type="radio" name="modifier" value="-10">
              <span><strong>−10</strong> — Recovering from major illness (heart disease, any operation or hospital stay) or on regular medication.</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="modifier" value="-5">
              <span><strong>−5</strong> — Injured, regressed or not improved in training/competition, get more than two colds/flu per year, have allergies or asthma, inconsistent training, or just getting back into training.</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="modifier" value="0" checked>
              <span><strong>0</strong> — Training consistently (up to two years) without any of the above problems.</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="modifier" value="5">
              <span><strong>+5</strong> — Training for more than two years without any of the above problems, and improving in competition.</span>
            </label>
          </div>
        </div>
      </form>

      <div class="result-box">
        <p class="muted" style="margin:0">MAF heart rate ceiling</p>
        <p class="value" id="maf-ceiling">—</p>
        <p class="muted" style="margin:0.5rem 0 0">Aerobic training zone (MAF −10 to MAF)</p>
        <p class="zone" id="maf-zone">—</p>
        <div class="notes" id="maf-notes"></div>
      </div>

      <p class="disclaimer">
        This calculator is for educational purposes only and is not medical advice.
        Consult a qualified healthcare provider before starting or changing any exercise program.
      </p>

      <script>${renderMafScript()}</script>
    `;

    return new Response(layout("MAF 180 Calculator", body), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
};
