var txtDom = document.getElementById("txt");


String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

var leftJustify = document.getElementById("left-justify");
var rightJustify = document.getElementById("right-justify");
var afterDelim = document.getElementById("space-after");
var getJustify = function() {
	if (leftJustify.checked)
  	return -1;
  if (rightJustify.checked)
  	return 1;
  return 0;
}

var doIt = function() {
  var fill = document.getElementById("replacement").value;
  if (!fill) fill = " ";
	var txt = txtDom.value;
  var lines = txt.split('\n');
  var news = [];
  var cols = [];
  var mat = [];
  
  const delimRX = new RegExp(`([${document.getElementById("delims").value}])(?=(?:[^"]|"[^"]*")*$)`, 'g');
  const delimLeftRX = new RegExp(`[ \t]+([${document.getElementById("delims").value}])`, 'g');
  const delimRightRX = new RegExp(`([${document.getElementById("delims").value}])[ \t]+`, 'g');
  let cnt = 0;
  lines.forEach(function (line) {
  	line = line.trim();
    line = line.replaceAll(/[ \t]{2,}/g, " ");
    if (document.getElementById("wipe-adjacent-left").checked)
    	line = line.replace(delimLeftRX, "$1");
    if (document.getElementById("wipe-adjacent-right").checked)
    	line = line.replace(delimRightRX, "$1");


  	let idx = 0;
  	let pos = -1;
    let pre = -1;
    do {
      if (mat[cnt] === undefined)
      	mat[cnt] = [0];
    
      //pos = line.indexOf(delim, pos + 1);
      let match = delimRX.exec(line);
      pos = match === null ? -1 : match.index;
      if (cols[idx] === undefined)
      	cols[idx] = 0;
      if (pos !== -1 && cols[idx] < pos - pre)
        cols[idx] = pos - pre - 1;
      else if (pos === -1 && cols[idx] < line.length - pre - 1)
      	cols[idx] = line.length - pre - 1;
      
      if (pos !== -1)
      	mat[cnt][idx] = pos;
      
      pre = pos;
      idx++;
    } while (pos != -1 && pos <= line.length && idx < 100)
    lines[cnt++] = line;
    //console.log(cols);
  });
  //console.log(mat);
  
  //mat is the index of the comma
  //col is the width of each column
  cnt = 0;
  maxLen = 0;
  lines.forEach(function (line) {
  	line = line.trim();
  	for(i = mat[cnt].length - 2; i >= 0; i--) {
    	let a = 1;
      let b = 0;
      if (rightJustify.checked) {a = 0; b = 1;}
      if (afterDelim.checked) {b++;}
    	len = mat[cnt][i+1] - mat[cnt][i] - 1;
    	line = line.splice(mat[cnt][i+a]+b, 0, fill.repeat(cols[i+1] - len));
    }
    if (rightJustify.checked) idx = 0;
    else if (leftJustify.checked) idx = mat[cnt][0];
    line = line.splice(idx, 0, fill.repeat(cols[0] - mat[cnt][0]));
    if (line.length > maxLen)
    	maxLen = line.length;
      
    lines[cnt++] = line;
    news.push(line)
    
	});
  
  txtDom.value = news.join("\n");
  txtDom.cols = maxLen;
}


//doIt();
