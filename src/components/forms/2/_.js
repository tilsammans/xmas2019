export default function(element) {

    if (!element) return;

    element.addEventListener('input', refocus);

    // Do an Ajax request to a Netlify function.
    function verifyPin(code) {
        const options = { method: 'GET', headers: { 'Content-Type': 'application/json' } };
        let request = new Request(`/.netlify/functions/verify-pin?code=${code}`, options);

        fetch(request)
            .then(function(response) {
                return response.json();
            });
    }

    function refocus(event) {
        const form = event.target.form;
        const flipContainer = document.querySelector('.flip-container');

        if (form.reportValidity()) {
            if (!flipContainer) return;

            window.xmas.result = verifyPin('1234');

            flipContainer.classList.add('unlocked');
        } else {
            flipContainer.classList.remove('unlocked');

            const firstInvalid = document.querySelector('input:invalid');

            if (!firstInvalid) return;

            firstInvalid.focus();
        }
    }
}
