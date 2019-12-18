export default function(element) {

    if (!element) return;

    element.addEventListener('input', refocus);

    function refocus(event) {
        const form = event.target.form;
        const flipContainer = document.querySelector('.flip-container');

        if (form.reportValidity()) {
            if (!flipContainer) return;

            flipContainer.classList.add('unlocked');
        } else {
            flipContainer.classList.remove('unlocked');
            
            const firstInvalid = document.querySelector('input:invalid');

            if (!firstInvalid) return;

            firstInvalid.focus();
        }
    }
}
