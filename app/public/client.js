import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js'
import { getDatabase, onValue, ref, get, child } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js';
import {
    GoogleAuthProvider,
    signInWithPopup,
    getAuth,
    signInWithRedirect,
    setPersistence, browserSessionPersistence
} from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';


const firebaseConfig = {
    apiKey: "AIzaSyC1Qhzu5BG2ZWIEy0_XtN-b-1j057LUfC8",
    authDomain: "leadtechnique2022.firebaseapp.com",
    databaseURL: "https://leadtechnique2022-default-rtdb.firebaseio.com",
    projectId: "leadtechnique2022",
    storageBucket: "leadtechnique2022.appspot.com",
    messagingSenderId: "555327172157",
    appId: "1:555327172157:web:143d2e9ebe0117b8da0454"
}

const provider = new GoogleAuthProvider();

const app = initializeApp(firebaseConfig);
const auth = getAuth();
setPersistence(auth, browserSessionPersistence).then(() => {
    if (auth.currentUser)  loginOk()
})
const googleLogin = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            loginOk()
        }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
    });
}

const googleBtn = document.querySelector('.js-google-login')
const zipBtn = document.querySelector('.js-ajax-zip')
const tags = zipBtn.dataset.tags
const downloadBtn = document.querySelector('.js-download-zip')
const zipList = document.querySelector('.js-zip-list')

const loginOk = async () => {
    const database = getDatabase()
    const tagsRef = ref(database, `johann/test/${tags}`)
    onValue(tagsRef, snapshot => updateButton(snapshot.val()))
}

const updateButton = data => {
    if (data?.zip) setDownloadUrl(data.zip)
    if (data?.progress || data?.progress === 0) return
}

const setDownloadUrl = async file => {
    const downloadUrl = await fetch('/getZipUrl?file=' + file).then(res => res.text())
    downloadBtn.href = downloadUrl
}

zipBtn.addEventListener('click', () => fetch(`/zip?tags=${tags}`))

googleBtn.addEventListener('click', () => googleLogin())


const dbRef = ref(getDatabase());
get(child(dbRef, `johann/test`)).then(async (snapshot) => {
    if (snapshot.exists()) {
        for (const [key, value] of Object.entries(snapshot.val())) {
            const li = document.createElement("a");

            const url = await fetch('/getZipUrl?file=' + value.zip).then(res => res.text())

            li.innerText = key
            li.href = url
            zipList.append(li);
        }
    } else {
        console.log("No data available");
    }
}).catch((error) => {
    console.error(error);
});
