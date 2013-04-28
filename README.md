<h1>
<a name="bootstrap-popoverx" class="anchor" href="#bootstrap-popoverx"><span class="mini-icon mini-icon-link"></span></a>bootstrap-popoverx</h1>

<p>bootstrap-popoverx extends bootstrap-popover and add several functions.You can use like this<br>
<pre><code>
$('#popover_button').popoverx({
    // html:true,
        title:'popoverx',
        width:400,
        height:300,
        url:'test.html',
        onHidden:function(){
            console.log($('#test').html());
        },
        onShown:function(){
            $('#test').html('test');
        },
        fire_on:'dbclick',
        ondepend:'body'
    });
</code></pre>
<br></p>


<h1>
<a name="feature-overview" class="anchor" href="#feature-overview"><span class="mini-icon mini-icon-link"></span></a>feature overview</h1>

<ul>
<li>ajax load</li>
  <li>callback functions</li>
  <li>custom fire_on 'click' 'dblclick'...</li>
  <li>set data to popover and get data from popover</li>
</ul><h1>
<a name="installation" class="anchor" href="#installation"><span class="mini-icon mini-icon-link"></span></a>Installation</h1>

<ul>
<li>install bootstrap</li>
  <li>include <code>bootstrap-popoverx.js</code>
</li>
</ul><h1>
<a name="overview-popoverx-properties" class="anchor" href="#overview-popoverx-properties"><span class="mini-icon mini-icon-link"></span></a>overview popoverx properties</h1>

<pre>
<code>
  $.fn.popoverx.defaults = $.extend({}, $.fn.popover.defaults, {
    title:null,  //popover title
    width:null,  
    height:null,
    content:null, //popover content ( must set content or url )
    url:null,   //ajax load url
    onHidden:null, //trigger when popover hide
    onShown:null,  //trigger when popover show
    fire_on:null,  //click dblclick ...
    ensure_visiable:true,//set popover's position in the correct
    ondepend:'body'  //click the ondepend popover hide
  })
</code>
</pre>
