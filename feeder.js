var textClasses = [
//    '.description b',
    '.post h2 a',
    '.post h2 a',
    '.sidebar_featured_unified ul li h3 a span',
    '.title_small',
    '.BF_SPLASHSU_HEADLINE',
    '#splash_01 .splash-desc',
    '#nav_menu #nav_menu_left ul li .title_small'
];


var text = [];
var chain = {};
var startWords = [];

var titles = $(textClasses.join(', '));

var cleanText = function(text) {
    text = $.trim(text);
    var remove = ['”', '\"', '“', '(', ')'];
    for (var i=0; i<remove.length; i++) {
        text = text.split(remove[i]).join('');
    }
    text = text.replace(/^The(se)?\s[0-9]+/g,'##');
    text = text.replace(/^[0-9]+/, '##');
    return text;
}

var generateText = function(wordChain, isTitle) {
    var result = '';
    if (isTitle) {
        result = Math.floor(Math.random()*3) == 0 ?
            (Math.floor(Math.random()*3) ? 'These' : 'The') : '';
        result = Math.floor(Math.random()*150);
        var current = '##';
    } else {
        var current = startWords[Math.floor(Math.random()*startWords.length-1)];
        result = current;
    }

    for (var i=0; i<400; i++) {
        if (wordChain[current]) {
            if (i > 4 && wordChain[current].indexOf('<<') >= 0) {
                if (Math.floor(Math.random()*3) == 0) {
                    return result;
                }
            }
            current = wordChain[current][Math.floor(Math.random()*wordChain[current].length)];
        } else {
            console.log('BUZZBUZZ ERROR: NO WORD FOLLOWING ' + current);
            return result;
        }
        if (current === '<<') {
            return result;
        }

        result += ' ' + current;
    }
    return result;
}

titles.each(function(index) {
    if ($(this).children().length == 0 && $(this).text()) {
        cleaned = cleanText($(this).text());
        text.push(cleaned);
        if (cleaned.split(' ')[0] != '##') {
            startWords.push(cleaned.split(' ')[0]);
        }
    }
});

for (var i=0; i<text.length; i++) {
    var words = text[i].split(' ');
    for (var j=0; j<words.length-1; j++) {
        var word = words[j];
        if (chain[word]) {
            chain[word].push(words[j+1]);
        } else {
            chain[word] = [words[j+1]];
        }
    }
    if (chain[words[words.length-1]]) {
        chain[words[words.length-1]].push('<<');
    } else {
        chain[words[words.length-1]] = ['<<'];
    }
}

$('.post h2 a').each(function(index) {
    $(this).text(generateText(chain, true));
});

$('.description b').each(function(index) {
        $(this).text(generateText(chain), false);
});

