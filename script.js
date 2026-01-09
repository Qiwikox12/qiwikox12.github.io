// Tabs
$(".tablink").click(function(){
    $(".tabcontent").hide();
    $(".tablink").removeClass("active");
    $(this).addClass("active");
    $("#" + $(this).data("tab")).fadeIn(400);
});

// Custom Select
$(".select-trigger").click(function(e){
    e.stopPropagation();
    const parent = $(this).parent();
    $(".custom-select").not(parent).removeClass("open");
    parent.toggleClass("open");
});

$(".option").click(function(){
    const value = $(this).data("value");
    const text = $(this).text();
    const parent = $(this).closest(".custom-select");
    parent.find(".select-trigger").text(text);
    parent.removeClass("open");
    parent.data("value", value);
});

$(document).click(function(){
    $(".custom-select").removeClass("open");
});

// Helpers
function getSelectValue(id) {
    return $(`#${id}`).data("value") || $(`#${id} .select-trigger`).text().trim().toLowerCase();
}

// Calculations
function calculateSimple() {
    let players = parseInt($("#players1").val()) || 1;
    if (players < 1 || players > 255) {
        $("#result1").html("Enter 1–255 players!");
        return;
    }

    let multiplier = 1.0;
    if (players === 1) multiplier = 1.0;
    else if (players === 2) multiplier = 1.35;
    else {
        let current = 0.35;
        let total = 1 + current;
        for (let p = 3; p <= players; p++) {
            let next = current + (1 - current) / 3;
            total += next;
            current = next;
        }
        multiplier = players >= 10 ? (total * 2 + 8) / 3 : total;
    }

    $("#result1").html(
        `Health Multiplier: <strong>×${multiplier.toFixed(4)}</strong><br>` +
        `(+${(multiplier * 100 - 100).toFixed(1)}%)`
    );
}

function calculateFull() {
    const players = parseInt($("#players2").val()) || 1;
    if (players < 1 || players > 255) {
        $("#result2").html("Players: 1–255 only");
        return;
    }

    const boss = $("#boss-select").data("value") || "King Slime";
    const mode = $("#difficulty-select").data("value") || "expert";

    const bossHealthList = {
        "King Slime": 2800,
        "Eye of Cthulhu": 3640,
        "Eater of Worlds": 15120,
        "Brain of Cthulhu": 2125,
        "Queen Bee": 4760,
        "Skeletron": 8800,
        "Deerclops": 11900,
        "Wall of Flesh": 11200,
        "Queen Slime": 28800,
        "The Twins": 34500,
        "The Destroyer": 120000,
        "Skeletron Prime": 42000,
        "Plantera": 42000,
        "Golem": 90000,
        "Duke Fishron": 72000,
        "Empress of Light": 98000,
        "Lunatic Cultist": 40000,
        "Moon Lord": 217500
    };

    let health = bossHealthList[boss] || 1000;

    if (mode === "master")      health *= 1.275;
    if (mode === "expertftw")   health *= 1.5;
    if (mode === "legendary")   health *= 1.7;

    let mpFactor = 1;
    let add = 0.35;
    for (let i = 1; i < players; i++) {
        mpFactor += add;
        add += (1 - add) / 3;
    }
    if (players >= 10) mpFactor = (mpFactor * 2 + 8) / 3;

    const final = Math.floor(health * mpFactor);

    $("#result2").html(`<strong>${final.toLocaleString('en-US')}</strong> HP`);
}

function calculateShimmer() {
    const name = getSelectValue("guide-name-select");
    const side = getSelectValue("jungle-side-select");
    const size = getSelectValue("world-size-select");

    const nameLib = ["joe","connor","tanner","wyatt","codi","levi","luke","jack","scott","logan","cole","asher","bradley","jacob","garrett","dylan","maxwell","steve","brett","andrew","harley","kyle","jake","ryan","jeffrey","seth","marty","brandon","zach","jeff","daniel","trent","kevin","brian","colin","jan"];
    const valueLib = [0,0.0278,0.0556,0.0833,0.1111,0.1389,0.1667,0.1994,0.2222,0.25,0.2778,0.3056,0.3333,0.3611,0.3889,0.4167,0.4444,0.4722,0.5,0.5278,0.5556,0.5833,0.6111,0.6389,0.6667,0.6944,0.7222,0.75,0.7778,0.8056,0.8333,0.8611,0.8889,0.9167,0.9444,0.9722];

    const idx = nameLib.indexOf(name);
    if (idx === -1) {
        $("#result-box").val("Error: unknown name");
        return;
    }

    const value = valueLib[idx];
    const isRight = side === "right";
    const sizeIdx = {small:0, medium:1, large:2}[size] ?? 0;

    const initial = isRight ? [3276, 4992, 6552] : [3800, 6000, 8000];
    const amp = [524, 1008, 1448];

    let result = isRight
        ? initial[sizeIdx] + (amp[sizeIdx] * value)
        : initial[sizeIdx] - (amp[sizeIdx] * value);

    $("#result-box").val(Math.round(result));
}

// Init
$(document).ready(function(){
    $("#boss-select, #difficulty-select, #guide-name-select, #jungle-side-select, #world-size-select")
        .each(function(){
            const first = $(this).find(".option").first();
            $(this).data("value", first.data("value"));
            $(this).find(".select-trigger").text(first.text());
        });

    calculateSimple();
});
