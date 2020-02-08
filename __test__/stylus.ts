/* eslint-disable @typescript-eslint/no-unused-vars */
import stylus from "stylus";

const styleData = `
ul
   margin: 0
li
  list-style: none
  a
    display: block
    text-decoration: none
    padding: 5px 10px
    &:hover
      text-decoration: underline`;

const example1 = `
border-radius()
  -webkit-border-radius: arguments
  -moz-border-radius: arguments
  border-radius: arguments

body a
  font: 12px/1.4 "Lucida Grande", Arial, sans-serif
  background: black
  color: #ccc

form input
  padding: wit
  border: 1px solid
  border-radius: 5px`;
const example2 = `
  box-shadow(args...)
   -webkit-box-shadow args
   -moz-box-shadow args
   box-shadow args

 #login
   box-shadow 1px 2px 5px #eee
  `;

const ty: Record<string, string> = {};

const style = stylus(example2)
    .set("filename", "file.styl")
    .set("sourcemap", {});

style.render(function(err, css) {
    // generated sourcemap object
    ty.map = (style as any).sourcemap;
    ty.code = css;
});
import fs = require("fs");
const nodes = stylus.nodes,
    utils = stylus.utils;

function add(a, b): any {
    return a.operate("+", b);
}

function sub(a, b): any {
    return a.operate("-", b);
}

function imageDimensions(img): any {
    // assert that the node (img) is a String node, passing
    // the param name for error reporting
    utils.assertType(img, "string", "img");
    const path = img.val;

    // Grab bytes necessary to retrieve dimensions.
    // if this was real you would do this per format,
    // instead of reading the entire image :)
    const data = fs.readFileSync(__dirname + "/" + path).toString();

    // GIF
    // of course you would support.. more :)
    let w, h;
    if ("GIF" == data.slice(0, 3).toString()) {
        w = data.slice(6, 8);
        h = data.slice(8, 10);
        w = (w[1] << 8) | w[0];
        h = (h[1] << 8) | h[0];
    }

    return [w, h];
}

function imageWidth(img): any {
    return new nodes.Unit(imageDimensions(img)[0], undefined);
}

function imageHeight(img): any {
    return new nodes.Unit(imageDimensions(img)[1], undefined);
}

let $code: string;

stylus(example1, {
    globals: {
        wit: "16px"
    }
})
    .set("filename", "js-functions.styl")
    .render(function(err, css) {
        if (err) throw err;
        $code = css;
    });

console.log($code);

console.log(ty);
