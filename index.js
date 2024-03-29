function sortXML(xml) {
  for (let i = 0; i < xml.childNodes.length; i++) {
    const node = xml.childNodes[i];
    if (node.nodeType === 1 && node.hasChildNodes()) {
      const sortedChildNodes = Array.from(node.childNodes)
        .filter(childNode => childNode.nodeType === 1)
        .sort((a, b) => a.nodeName.localeCompare(b.nodeName));
      sortedChildNodes.forEach(childNode => node.appendChild(childNode));
      sortXML(node);
    }
  }
  return xml;
}
    
function SortData() {
  let xmlString = document.getElementById('inputarea').value.toString();
  if (xmlString.includes('<root>') && xmlString.includes('</root>')) {
    // Input string already contains <root> and </root>, so return as is
    xmlString = xmlString;
  } else {
    // Input string does not contain <root> and </root>, so add them
    xmlString = '<root>' + xmlString + '</root>';
  }
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlString, "application/xml");
  if (xml.getElementsByTagName("parsererror").length > 0) {
    alert("Invalid XML");
  }
  else {
    const sortedXml = sortXML(xml);
    var newstr = sortedXml.documentElement.outerHTML;
    let removed = newstr.replace(/<\/?root>/g, '');
    var formatted = formatXml(removed);
    document.getElementById('outputarea').value = formatted;
  }
}

function formatXml(xml) {
  var formatted = '';
  var reg = /(>)(<)(\/*)/g;
  xml = xml.replace(reg, '$1\r\n$2$3');
  var pad = 0;
  xml.split('\r\n').forEach(function (node, index) {
    var indent = 0;
    if (node.match(/.+<\/\w[^>]*>$/)) {
      indent = 0;
    } else if (node.match(/^<\/\w/)) {
      if (pad != 0) {
        pad -= 1;
      }
    } else if (node.match(/^<\w[^>]*[^/]>.*$/)) {
      indent = 1;
    } else {
      indent = 0;
    }
    var padding = '';
    for (var i = 0; i < pad; i++) {
      padding += '  ';
    }
    formatted += padding + node + '\r\n';
    pad += indent;
  });
  return formatted;
}

function highlightXmlTags(textBoxId) {
  const textBox = document.getElementById(textBoxId);
  hljs.highlightBlock(textBox);
}