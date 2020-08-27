<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    this.$store.dispatch('fetchDairy');
  },
};
</script>

<style>
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  box-sizing: border-box;
}
ul {
  list-style: none;
}
a {
  text-decoration: none;
  color: #0179f1;
}
button {
  padding: 5px 10px;
  cursor: pointer;
  font-size: 16px;
}
button:focus {
  outline: none;
}
/*button:hover {*/
/*  background: #6f6f70;*/
/*  color: #ffffff;*/
/*  border-color: #6f6f70;*/
/*}*/
#app {
  width: 100%;
  max-width: 700px;
  margin: auto;
  padding: 10px 15px;
  border: 1px solid #6f6f70;
}
</style>
