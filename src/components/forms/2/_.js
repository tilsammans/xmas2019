import faunadb, { query as q } from 'faunadb';
import Fingerprint2 from 'fingerprintjs2';

const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

function getFingerprint() {
    const options = {
        excludes: {
            adBlock: true,
            addBehavior: true,
            audio: true,
            canvas: true,
            doNotTrack: true,
            enumerateDevices: true,
            fonts: true,
            fontsFlash: true,
            indexedDb: true,
            localStorage: true,
            openDatabase: true,
            pixelRatio: true,
            plugins: true,
            sessionStorage: true,
            userAgent: true,
            webgl: true,
        }
    };

    Fingerprint2.get(options, function(components) {
        var values = components.map(function(component) { return component.value; });
        var murmur = Fingerprint2.x64hash128(values.join(''), 31);
        window.xmas.components = components;
        window.xmas.fingerprint = murmur;
    });
}

if(window.requestIdleCallback) {
    requestIdleCallback(getFingerprint);
} else {
    setTimeout(getFingerprint, 500);
}

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

        var timeBack = q.TimeSubtract(q.Now(), 1, 'day');
        client.query(
            q.Get(
                q.Match(
                    q.Index('client_attempts'),
                    [{after: timeBack}, window.xmas.fingerprint]
                )
            )
        );

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
