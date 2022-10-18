const quotes = ["You can get everything in life you want if you will just help enough other people get what they want.",
"Inspiration does exist, but it must find you working.",
"Don't settle for average. Bring your best to the moment.",
"Show up, show up, show up, and after a while the muse shows up, too.",
"Don't bunt. Aim out of the ballpark. Aim for the company of immortals.",
"I have stood on a mountain of no’s for one yes — Barbara Elaine Smith",
"If you believe something needs to exist, if it's something you want to use yourself, don't let anyone ever stop you from doing it.",
"First forget inspiration. Habit is more dependable. Habit will sustain you whether you're inspired or not.",
"A successful man is one who can lay a firm foundation with the bricks others have thrown at him.",
"The best way out is always through ― Robert Frost.",
"Develop success from failures. Discouragement and failure are two of the surest stepping stones to success — Dale Carnegie",
"Relentlessly prune bullshit, don't wait to do things that matter, and savor the time you have. That's what you do when life is short.",
"More is lost by indecision than wrong decision — Marcus Tullius Cicero.",
"If the highest aim of a captain were to preserve his ship, he would keep it in port forever.",
"Insanity is doing the same thing over and over again and expecting different results.",
"Keep a little fire burning; however small, however hidden.",
"Don’t worry about failure; you only have to be right once - Drew Houston",
"Never let success get to your head and never let failure get to your heart."
];

let recentQuotes;
let test_timerId, question_timeOutId;
let current_question;
let current_demo_text, user_input;
let current_word;
let isCorrect = true;
let wpm, cpm, errors, wpm_ttl, cpm_ttl, errors_ttl;
const demo_txt_El = document.querySelector( '.demo-text' );
const input_El = document.getElementById( 'feeder' );
const btn_restart = document.querySelector( '.restart' );
const time_El = document.querySelector( '.time');
const wpm_El = document.getElementById( 'wpm' );
const cpm_El = document.getElementById( 'cpm' );
const wpm_cpm_containers = document.querySelectorAll( '.toggle-view' );
const errors_El = document.getElementById( 'errors' );
const accuracy_El = document.getElementById( 'accuracy' );

btn_restart.addEventListener( 'click', testRestart );

function start_test(){
    input_El.removeEventListener('focus', start_test );
    triggerNewQuote();
    start_test_countDown();
};

function show_wpm_cpm( choice ){
    if( choice ){
        wpm_cpm_containers.forEach((element) => {
                element.classList.remove( 'd-none' );
            });
    }
    else{
        wpm_cpm_containers.forEach((element) => {
            element.classList.add( 'd-none' );
        });
    };
};

function clearTimers(){
    if( test_timerId !== undefined ){
        clearInterval(test_timerId);
        test_timerId = undefined;
    };
    if( question_timeOutId !== undefined ){
        clearTimeout(question_timeOutId);
        question_timeOutId = undefined;
    };
};

function testRestart(){
    recentQuotes = [-1,-1,-1];
    clearTimers();
    current_question = -1;
    current_demo_text = '';
    user_input = '';
    wpm_ttl = 0;
    cpm_ttl = 0;
    errors_ttl = 0;
    show_wpm_cpm( false );
    demo_txt_El.classList.remove( 'result-style' );
    demo_txt_El.innerHTML = 'Demo text';
    time_El.innerText = '60s';
    errors_El.textContent = '0';
    accuracy_El.textContent = '100';
    input_El.value = '';
    input_El.addEventListener( 'focus', start_test );
    input_El.addEventListener('input', key_in );
};
testRestart();

function show_live_score(){
    let errors_tmp = errors_ttl + errors;
    let cpm_tmp = cpm + cpm_ttl;
    errors_El.textContent = errors_tmp;
    let accuracyVal = Math.round((cpm_tmp - errors_tmp)/ (cpm_tmp + errors_tmp) *100);
    accuracy_El.textContent = isNaN(accuracyVal) ? 0 : accuracyVal;
}

function showResult(){
    input_El.removeEventListener('input', key_in );
    show_wpm_cpm( true );
    demo_txt_El.innerHTML = "Click on the button to restart";
    input_El.value = user_input;
    wpm_El.textContent = wpm_ttl;
    cpm_El.textContent = cpm_ttl;
    errors_El.textContent = errors_ttl;
    let accuracyVal = Math.round((cpm_ttl - errors_ttl)/ (cpm_ttl + errors_ttl) *100);
    accuracy_El.textContent = isNaN(accuracyVal) ? 0 : accuracyVal;
};

function key_in(event){
    if( event.data !== " " ){
        user_input = input_El.value;
        evaluate_QnA(current_question, user_input);
        demo_txt_El.innerHTML = current_demo_text;
        show_live_score();
    }
}

function evaluate_QnA( q_index, ans ){
    current_demo_text = '';
    current_word = false;
    wpm = 0;
    cpm = 0;
    errors = 0;
    let questionArry = quotes[q_index].split(' ');
    let answersArry = ans.split(' ');
    cpm += ans.length;
    let answerWords = answersArry.length;
    let cntr = 0;
    let ansWord = '';
    for( cntr = 0; cntr < answerWords; cntr++ ){
        if(cntr === answerWords-1){current_word = true};
        ansWord = answersArry[cntr];
        if ( ansWord !== '') { 
            wpm++;
            current_demo_text += compare_words( questionArry[cntr], ansWord ) + ' ';
        }
        else{
            cntr = Math.max(0, cntr--);
            break;
        }
    };
    if(questionArry.length > cntr){
        current_demo_text += "<font color='black'> ";
        current_demo_text += questionArry.slice(cntr).join(' ');
    };
};

function compare_words( qstn, ans ){
     let temp = '';
     let rslt = '';
     let i = 0;
     for ( i = 0; i < qstn.length; i++ ){
        if(current_word && (ans[i] === undefined)){break};
        if((ans[i] === qstn[i]) === isCorrect){
            temp += qstn[i];
        }
        else{
            rslt += appendFormattedText( temp, isCorrect );
            temp = '';
            temp += qstn[i];
            isCorrect = (ans[i] === qstn[i]);
        }
    };
    if(temp.length > 0){
        rslt += appendFormattedText( temp, isCorrect );
    };
    if( qstn.length > i ){
        rslt += "<font color='black'>" + qstn.substring( i );
    } 
    return rslt;
};

function appendFormattedText( appndtext, isCorrect ){
    if( isCorrect ){
        return ("<font color='green'>" + appndtext);
    }
    else{
        errors += appndtext.length;
        return ("<font color='red'>" + appndtext);
    };
};

function triggerNewQuote(){
    let quote = getOneQuote();
    demo_txt_El.textContent = quote;
    set_question_time( (quote.length/5)*1000 );
};

function setReady_nextQuote(){
    input_El.value = '';
    wpm_ttl += wpm;
    cpm_ttl += cpm;
    errors_ttl += errors;
    wpm = 0;
    cpm = 0;
    errors = 0;
};

function set_question_time( timeInMs ){
    question_timeOutId = setTimeout(function(){
        setReady_nextQuote();
        triggerNewQuote();
    }, timeInMs);
};

function start_test_countDown(){
    if (test_timerId === undefined){
        let balTime = 60;
        test_timerId = setInterval(function(){
            balTime--;
            time_El.innerText = balTime + 's';
            if (balTime < 1){
                clearTimers();
                alert('Time is up!');
                setReady_nextQuote();
                showResult();
                return;
            }
        }, 1000);
    };
}

function getOneQuote(){
    let index;
    index = getRandomNumber(0, quotes.length-1);
    current_question = index;
    return quotes[index];
};

function getRandomNumber( min, max ){
    return Math.floor((Math.random() * (max - min ) + 1) + min);
};
