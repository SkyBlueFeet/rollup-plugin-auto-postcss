import sass, { SassError, Result } from "node-sass";

sass.render(
    {
        data: `@mixin left {float: left; margin-left: 10px; } div {@include left; }`,
        file: "test.scss",
        sourceMap: "test123.scss",
        sourceComments: true,
        sourceMapContents: true
    },
    (err: SassError, res: Result) => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log(res.css.toString());
            console.log(res.map && res.map.toString());
        }
        return;
    }
);
