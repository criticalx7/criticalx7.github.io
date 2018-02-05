let timerInterval;
let playTimeInterval;
let question_set;
let current_question;
let time = 100;
let playTime = 0;
let life = 3;
let score = 0;
let question_done = 0;
let question_amount = 10;
$(document).ready(function () {
    let buttonBox = $('#button-box');
    buttonBox.delay(300).fadeIn(600);
    buttonBox.find('button').on('click', function () {
        switch (this.id) {
            case 'easy':
                question_amount = 10;
                break;
            case 'normal':
                question_amount = 20;
                break;
        }
        prepareApp()
    });

    $("#back-menu").on('click', function () {
        $("#result-box").height("0%").fadeOut(600);
        $('#menu-box').slideDown('slow');
    });
});

function prepareApp() {
    playTime = 0;
    question_done = 0;
    time = 100;
    score = 0;
    life = 3;
    $('#menu-box').slideUp('slow');
    $('.game-box').height('100%').fadeIn(1200);
    $.getJSON('resources/data.json', function (data) {
        question_set = data.questions;
        playTimeInterval = setInterval(playTimeRunner, 1000);
        advanceStage();
    });
}

function advanceStage() {
    if (life === 0 || question_done >= question_amount) {
        showResult();
    } else {
        prepareNext();
        current_question = randomQuestion(question_set);
        shuffle(current_question.choice);
        showQuestion(current_question);
        clearInterval(timerInterval);
        setTimeout(
            function () {
                timerInterval = setInterval(timerRunner, 10);
            }, 2000);
    }
}

function prepareNext() {
    setTimeout(
        function () {
            $('#emote').removeClass("damage-text");
            $('#life-bar').removeClass("damage-block");
            console.log("remove shake");
        }, 1000);
    $('#time').removeClass('flash');
    time = 100;
    question_done++;
}

function timerRunner() {
    let timeBox = $("#time");
    if (time <= 0) {
        lifeDown();
        advanceStage();
    } else {
        if (time <= 40 && !timeBox.hasClass('flash')) {
            timeBox.addClass('flash');
        }
        time -= 0.1;
        timeBox.width(time + "%");
    }
}

function playTimeRunner() {
    playTime += 1;
    $('#playtime').text(playTime + 's');
}

function randomQuestion(questions) {
    shuffle(questions);
    return questions.pop();
}

function showQuestion(question) {
    let lifebar = $('#life-bar');
    let questionBox = $("#question");
    let image = question.img;
    lifebar.html("");
    questionBox.html("");
    $('#choices').html("");
    $('#score').text('Score: ' + score);

    //draw life block
    for (i = 0; i < life; i++) {
        let lifeBlock = $('<div>').addClass('life-block');
        lifebar.append(lifeBlock);
    }
    //draw question
    if (image !== undefined) {
        let imageTag = $('<img src="">').attr("src", image);
        questionBox.append(imageTag);
    }
    questionBox.append(question.title);

    //draw choices
    $.each(question.choice, function (i) {
        let val = question.choice[i];
        $('#choices').append(createChoiceBox(val));
    });

    // reset choice event
    $('.choice-box').on('click', function () {
        clearInterval(timerInterval);
        let choice = $(this).text();
        if (choice === question.answer) {
            scoreUp();
        } else {
            lifeDown();
        }
        advanceStage();
    });
}

function showResult() {
    clearInterval(timerInterval);
    clearInterval(playTimeInterval);
    let resultBox = $('#result-box');
    let resultEmote = resultBox.find('h1');
    if (life <= 0) {
        resultEmote.text('(っ- ‸ – ς)');
    } else {
        resultEmote.text('＼（＾▽＾）／');
    }
    $('.game-box').fadeOut();
    $('#playtime-r').text("Play time: " + playTime + 's')
    $("#score-r").html("SCORE - " + score + '/' + question_amount);
    resultBox.height('100%').fadeIn(1200);
}


function createChoiceBox(choice) {
    return $('<div>')
        .text(choice)
        .addClass('general-box choice-box');
}

function scoreUp() {
    score++;
    $('#emote').addClass('damage-text');
}

function lifeDown() {
    life--;
    $('#life-bar').addClass('damage-block');
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

