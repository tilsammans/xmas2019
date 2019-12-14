export default function(element) {

    if (!element) return;

    element.addEventListener('input', refocus);

    function refocus(event) {
        const form = event.target.form;

        if (form.reportValidity()) {
            const flipContainer = document.querySelector('.flip-container');

            if (!flipContainer) return;

            flipContainer.classList.add('unlocked');
        } else {
            const firstInvalid = document.querySelector('input:invalid');

            if (!firstInvalid) return;

            firstInvalid.focus();
        }
    }
}
