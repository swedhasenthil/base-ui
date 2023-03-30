
window.addEventListener("DOMContentLoaded",() => {
    const fr = new RangeSlidingValue("dummy");
});

class RangeSlidingValue {
    constructor(id) {
        this.input = document.getElementById(id);
        this.output = document.querySelector('[data-tip]');
        this.values = this.output?.querySelector("[data-values]");
        this.init();
    }
    init() {
        this.input?.addEventListener("input",this.update.bind(this));
        this.update();
        this.populateValues();
    }
    update(e) {
        let value = this.input.defaultValue;
        // when manually set
        if (e) value = e.target?.value;
        // when initiated
        else this.input.value = value;
        
        const min = this.input.min || 0;
        const max = this.input.max || 100;
        const possibleValues = max - min;
        console.log("possibleValues", possibleValues);
        const relativeValue = (value - min) / possibleValues;
        const percentRaw = relativeValue * 100;
        const percent = +percentRaw.toFixed(2);
        const tipWidth = 2;
        const transXRaw = -tipWidth * relativeValue * possibleValues;
        const transX = +transXRaw.toFixed(2);
        const prop1 = "--percent";
        const prop2 = "--transX";
        
        this.input?.style.setProperty(prop1,`${percent}%`);
        this.output?.style.setProperty(prop1,`${percent}%`);
        this.values?.style.setProperty(prop2,`${transX}em`);
    }
    populateValues() {
        const digitSpan = document.createElement("span");
        digitSpan.className = "range__output-value";
        
        const { min, max} = this.input;
        
        for (let v = min; v <= max; ++v) {
            const newSpan = digitSpan.cloneNode();
            newSpan.innerText = v;
            this.values?.appendChild(newSpan);
        }
    }
}
