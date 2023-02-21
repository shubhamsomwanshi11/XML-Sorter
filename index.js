function SortData() { 
    const parser = new DOMParser();
    const xmlString = document.getElementById('inputarea').value.toString();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    const root = xmlDoc.documentElement;
    const childNodes = Array.from(root.childNodes);
    childNodes.sort((a, b) => a.tagName.localeCompare(b.tagName));
    const sortedXmlDoc = new DOMParser().parseFromString('<root></root>', 'application/xml');
    const sortedRoot = sortedXmlDoc.documentElement;
    for (const childNode of childNodes) {
        const sortedParentNode = sortedXmlDoc.createElement(childNode.tagName);
        const childElements = Array.from(childNode.getElementsByTagName('*'));
        childElements.sort((a, b) => a.tagName.localeCompare(b.tagName));
        for (const childElement of childElements) {
            sortedParentNode.appendChild(childElement.cloneNode(true));
        }
        sortedRoot.appendChild(sortedParentNode);
    }
    const serializer = new XMLSerializer();
    const sortedXmlString = serializer.serializeToString(sortedXmlDoc);
    var formatted = formatXml(sortedXmlString)
    document.getElementById('outputarea').value = formatted;
    highlightXmlTags('outputarea');
}

function formatXml(xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    xml.split('\r\n').forEach(function(node, index) {
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
  
  