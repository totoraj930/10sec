var startTime,
	interval;
var $count,
	$button,
	$rank,
	$tweet;
var cheat = false;

$(function() {
	$count = $("#count");
	$button = $("#button");
	$rank = $("#rank");
	$tweet = $("#tweet");

	$button.on("click", onClickButton);
});

function onClickButton(event) {
	var status = $(this).attr("data-status");
	switch (status){
		case "start":
			startCount();
			break;
		case "stop":
			stopCount();
			break;
		default:
			resetCount();
			break;
	}
}

function startCount() {
	startTime = new Date().getTime();
	interval = setInterval(function() {
		var ms = new Date().getTime() - startTime;
		updateCount(ms);
		if (cheat && ms >= 10*1000) stopCount();
		if (!cheat && !$count.hasClass("hide") && ms > 5*1000 && ms <= 6*1000) {
			$count.addClass("hide");
			$count.animate({"opacity": 0}, 500);
		} else if (!cheat && ms > 6*1000) {
			clearInterval(interval);
		}
	}, 10);
	$button.attr("data-status", "stop");
	$button.text("ストップ");
}

function stopCount() {
	var ms = new Date().getTime() - startTime;
	updateCount(ms);
	clearInterval(interval);

	$count.removeClass("hide");
	$count.stop();
	$count.animate({"opacity": 100}, 100);

	$rank.text(getRankMessage(ms));
	$tweet[0].href = getTweetLink(ms);
	$tweet.show();
	$button.attr("data-status", "reset");
	$button.text("リセット");
}

function resetCount() {
	startTime = 0;
	clearInterval(interval);

	$count.text("0.00");
	$rank.text("");
	$count.removeClass("hide");
	$count.stop();
	$count.animate({"opacity": 100}, 1000);
	$tweet.hide();
	$button.attr("data-status", "start");
	$button.text("スタート");
}

function updateCount(ms) {
	$count.text( (ms/1000^0) + "." + ("0"+(ms%1000/10^0)).slice(-2) );
}

function getRankMessage(ms) {
	var msg = "";
	if (ms < 9000)
		msg = "はやすぎ！";
	else if (9000 <= ms && ms < 9500)
		msg = "すこしはやい！";
	else if (9500 <= ms && ms < 10000)
		msg = "おしい！";
	else if (10000 <= ms && ms < 10010)
		msg = "ぴったり！！！";
	else if (10010 <= ms && ms < 10500)
		msg = "おしい！";
	else if (10500 <= ms && ms < 11000)
		msg = "すこしおそい！";
	else
		msg = "おそすぎ！"
	return msg;
}

function getTweetLink(ms) {
	var tweetLink = "https://twitter.com/intent/tweet?url=${URL}&text=${TEXT}",
		url = "http://totoraj930.github.io/10sec",
		text = "10秒で止めるやつ！\n結果は、『${RESULT}秒』でした！\nみんなも挑戦しよう";
	text = text.replace("${RESULT}", (ms/1000^0) + "." + ("0"+(ms%1000/10^0)).slice(-2));
	url = encodeURIComponent(url);
	text = encodeURIComponent(text);
	tweetLink = tweetLink.replace("${URL}", url).replace("${TEXT}", text);
	return tweetLink;
}
