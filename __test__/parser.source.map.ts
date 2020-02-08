const map =
    '{\n\t"version": 3,\n\t"file": "test1.scss",\n\t"sources": [\n\t\t"test1.scss"\n\t],\n\t"sourcesContent": [\n\t\t".v-list-item {\\n    &:active {\\n        font-size: 15px;\\n    }\\n}\\n@mixin left {\\n    float: left;\\n    margin-left: 10px;\\n}\\ndiv {\\n    @include left;\\n}\\n"\n\t],\n\t"names": [],\n\t"mappings": "AAAA,AACI,YADQ,AACP,OAAO,CAAC;EACL,SAAS,EAAE,IAAI;CAClB;;AAML,AAAA,GAAG,CAAC;EAHA,KAAK,EAAE,IAAI;EACX,WAAW,EAAE,IAAI;CAIpB"\n}';
const ty = JSON.parse(map.replace(/^\)]}'[^\n]*\n/, ""));

console.log(ty);
