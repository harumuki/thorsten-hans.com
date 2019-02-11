/*
 * FitVids 1.1
 * Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
 * Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
 * Released under the WTFPL license - http://sam.zoy.org/wtfpl/
 */
!(function(t) {
    'use strict';
    t.fn.fitVids = function(e) {
        var i = { customSelector: null };
        if (!document.getElementById('fit-vids-style')) {
            var r = document.head || document.getElementsByTagName('head')[0],
                d =
                    '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}',
                a = document.createElement('div');
            (a.innerHTML = '<p>x</p><style id="fit-vids-style">' + d + '</style>'), r.appendChild(a.childNodes[1]);
        }
        return (
            e && t.extend(i, e),
            this.each(function() {
                var e = [
                    "iframe[src*='player.vimeo.com']",
                    "iframe[src*='youtube.com']",
                    "iframe[src*='youtube-nocookie.com']",
                    "iframe[src*='kickstarter.com'][src*='video.html']",
                    'object',
                    'embed',
                ];
                i.customSelector && e.push(i.customSelector);
                var r = t(this).find(e.join(','));
                (r = r.not('object object')),
                    r.each(function() {
                        var e = t(this);
                        if (
                            !(
                                ('embed' === this.tagName.toLowerCase() && e.parent('object').length) ||
                                e.parent('.fluid-width-video-wrapper').length
                            )
                        ) {
                            var i =
                                    'object' === this.tagName.toLowerCase() || (e.attr('height') && !isNaN(parseInt(e.attr('height'), 10)))
                                        ? parseInt(e.attr('height'), 10)
                                        : e.height(),
                                r = isNaN(parseInt(e.attr('width'), 10)) ? e.width() : parseInt(e.attr('width'), 10),
                                d = i / r;
                            if (!e.attr('id')) {
                                var a = 'fitvid' + Math.floor(999999 * Math.random());
                                e.attr('id', a);
                            }
                            e
                                .wrap('<div class="fluid-width-video-wrapper"></div>')
                                .parent('.fluid-width-video-wrapper')
                                .css('padding-top', 100 * d + '%'),
                                e.removeAttr('height').removeAttr('width');
                        }
                    });
            })
        );
    };
})(window.jQuery || window.Zepto);

/* PrismJS 1.15.0
https://prismjs.com/download.html#themes=prism-okaidia&languages=markup+css+clike+javascript+csharp+bash+aspnet+coffeescript+ruby+docker+hcl+json+powershell+scss+typescript+sass+pug+yaml&plugins=toolbar+show-language */
var _self =
        'undefined' != typeof window ? window : 'undefined' != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {},
    Prism = (function() {
        var e = /\blang(?:uage)?-([\w-]+)\b/i,
            t = 0,
            n = (_self.Prism = {
                manual: _self.Prism && _self.Prism.manual,
                disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
                util: {
                    encode: function(e) {
                        return e instanceof a
                            ? new a(e.type, n.util.encode(e.content), e.alias)
                            : 'Array' === n.util.type(e)
                            ? e.map(n.util.encode)
                            : e
                                  .replace(/&/g, '&amp;')
                                  .replace(/</g, '&lt;')
                                  .replace(/\u00a0/g, ' ');
                    },
                    type: function(e) {
                        return Object.prototype.toString.call(e).slice(8, -1);
                    },
                    objId: function(e) {
                        return e.__id || Object.defineProperty(e, '__id', { value: ++t }), e.__id;
                    },
                    clone: function(e, t) {
                        var a = n.util.type(e);
                        switch (((t = t || {}), a)) {
                            case 'Object':
                                if (t[n.util.objId(e)]) return t[n.util.objId(e)];
                                var r = {};
                                t[n.util.objId(e)] = r;
                                for (var l in e) e.hasOwnProperty(l) && (r[l] = n.util.clone(e[l], t));
                                return r;
                            case 'Array':
                                if (t[n.util.objId(e)]) return t[n.util.objId(e)];
                                var r = [];
                                return (
                                    (t[n.util.objId(e)] = r),
                                    e.forEach(function(e, a) {
                                        r[a] = n.util.clone(e, t);
                                    }),
                                    r
                                );
                        }
                        return e;
                    },
                },
                languages: {
                    extend: function(e, t) {
                        var a = n.util.clone(n.languages[e]);
                        for (var r in t) a[r] = t[r];
                        return a;
                    },
                    insertBefore: function(e, t, a, r) {
                        r = r || n.languages;
                        var l = r[e],
                            i = {};
                        for (var o in l)
                            if (l.hasOwnProperty(o)) {
                                if (o == t) for (var s in a) a.hasOwnProperty(s) && (i[s] = a[s]);
                                a.hasOwnProperty(o) || (i[o] = l[o]);
                            }
                        var u = r[e];
                        return (
                            (r[e] = i),
                            n.languages.DFS(n.languages, function(t, n) {
                                n === u && t != e && (this[t] = i);
                            }),
                            i
                        );
                    },
                    DFS: function(e, t, a, r) {
                        r = r || {};
                        for (var l in e)
                            e.hasOwnProperty(l) &&
                                (t.call(e, l, e[l], a || l),
                                'Object' !== n.util.type(e[l]) || r[n.util.objId(e[l])]
                                    ? 'Array' !== n.util.type(e[l]) ||
                                      r[n.util.objId(e[l])] ||
                                      ((r[n.util.objId(e[l])] = !0), n.languages.DFS(e[l], t, l, r))
                                    : ((r[n.util.objId(e[l])] = !0), n.languages.DFS(e[l], t, null, r)));
                    },
                },
                plugins: {},
                highlightAll: function(e, t) {
                    n.highlightAllUnder(document, e, t);
                },
                highlightAllUnder: function(e, t, a) {
                    var r = {
                        callback: a,
                        selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
                    };
                    n.hooks.run('before-highlightall', r);
                    for (var l, i = r.elements || e.querySelectorAll(r.selector), o = 0; (l = i[o++]); )
                        n.highlightElement(l, t === !0, r.callback);
                },
                highlightElement: function(t, a, r) {
                    for (var l, i, o = t; o && !e.test(o.className); ) o = o.parentNode;
                    o && ((l = (o.className.match(e) || [, ''])[1].toLowerCase()), (i = n.languages[l])),
                        (t.className = t.className.replace(e, '').replace(/\s+/g, ' ') + ' language-' + l),
                        t.parentNode &&
                            ((o = t.parentNode),
                            /pre/i.test(o.nodeName) && (o.className = o.className.replace(e, '').replace(/\s+/g, ' ') + ' language-' + l));
                    var s = t.textContent,
                        u = { element: t, language: l, grammar: i, code: s },
                        g = function(e) {
                            (u.highlightedCode = e),
                                n.hooks.run('before-insert', u),
                                (u.element.innerHTML = u.highlightedCode),
                                n.hooks.run('after-highlight', u),
                                n.hooks.run('complete', u),
                                r && r.call(u.element);
                        };
                    if ((n.hooks.run('before-sanity-check', u), !u.code)) return n.hooks.run('complete', u), void 0;
                    if ((n.hooks.run('before-highlight', u), !u.grammar)) return g(n.util.encode(u.code)), void 0;
                    if (a && _self.Worker) {
                        var c = new Worker(n.filename);
                        (c.onmessage = function(e) {
                            g(e.data);
                        }),
                            c.postMessage(JSON.stringify({ language: u.language, code: u.code, immediateClose: !0 }));
                    } else g(n.highlight(u.code, u.grammar, u.language));
                },
                highlight: function(e, t, r) {
                    var l = { code: e, grammar: t, language: r };
                    return (
                        n.hooks.run('before-tokenize', l),
                        (l.tokens = n.tokenize(l.code, l.grammar)),
                        n.hooks.run('after-tokenize', l),
                        a.stringify(n.util.encode(l.tokens), l.language)
                    );
                },
                matchGrammar: function(e, t, a, r, l, i, o) {
                    var s = n.Token;
                    for (var u in a)
                        if (a.hasOwnProperty(u) && a[u]) {
                            if (u == o) return;
                            var g = a[u];
                            g = 'Array' === n.util.type(g) ? g : [g];
                            for (var c = 0; c < g.length; ++c) {
                                var f = g[c],
                                    h = f.inside,
                                    d = !!f.lookbehind,
                                    m = !!f.greedy,
                                    p = 0,
                                    y = f.alias;
                                if (m && !f.pattern.global) {
                                    var v = f.pattern.toString().match(/[imuy]*$/)[0];
                                    f.pattern = RegExp(f.pattern.source, v + 'g');
                                }
                                f = f.pattern || f;
                                for (var b = r, k = l; b < t.length; k += t[b].length, ++b) {
                                    var w = t[b];
                                    if (t.length > e.length) return;
                                    if (!(w instanceof s)) {
                                        if (m && b != t.length - 1) {
                                            f.lastIndex = k;
                                            var _ = f.exec(e);
                                            if (!_) break;
                                            for (
                                                var j = _.index + (d ? _[1].length : 0),
                                                    P = _.index + _[0].length,
                                                    A = b,
                                                    O = k,
                                                    x = t.length;
                                                x > A && (P > O || (!t[A].type && !t[A - 1].greedy));
                                                ++A
                                            )
                                                (O += t[A].length), j >= O && (++b, (k = O));
                                            if (t[b] instanceof s) continue;
                                            (I = A - b), (w = e.slice(k, O)), (_.index -= k);
                                        } else {
                                            f.lastIndex = 0;
                                            var _ = f.exec(w),
                                                I = 1;
                                        }
                                        if (_) {
                                            d && (p = _[1] ? _[1].length : 0);
                                            var j = _.index + p,
                                                _ = _[0].slice(p),
                                                P = j + _.length,
                                                N = w.slice(0, j),
                                                S = w.slice(P),
                                                E = [b, I];
                                            N && (++b, (k += N.length), E.push(N));
                                            var C = new s(u, h ? n.tokenize(_, h) : _, y, _, m);
                                            if (
                                                (E.push(C),
                                                S && E.push(S),
                                                Array.prototype.splice.apply(t, E),
                                                1 != I && n.matchGrammar(e, t, a, b, k, !0, u),
                                                i)
                                            )
                                                break;
                                        } else if (i) break;
                                    }
                                }
                            }
                        }
                },
                tokenize: function(e, t) {
                    var a = [e],
                        r = t.rest;
                    if (r) {
                        for (var l in r) t[l] = r[l];
                        delete t.rest;
                    }
                    return n.matchGrammar(e, a, t, 0, 0, !1), a;
                },
                hooks: {
                    all: {},
                    add: function(e, t) {
                        var a = n.hooks.all;
                        (a[e] = a[e] || []), a[e].push(t);
                    },
                    run: function(e, t) {
                        var a = n.hooks.all[e];
                        if (a && a.length) for (var r, l = 0; (r = a[l++]); ) r(t);
                    },
                },
            }),
            a = (n.Token = function(e, t, n, a, r) {
                (this.type = e), (this.content = t), (this.alias = n), (this.length = 0 | (a || '').length), (this.greedy = !!r);
            });
        if (
            ((a.stringify = function(e, t, r) {
                if ('string' == typeof e) return e;
                if ('Array' === n.util.type(e))
                    return e
                        .map(function(n) {
                            return a.stringify(n, t, e);
                        })
                        .join('');
                var l = {
                    type: e.type,
                    content: a.stringify(e.content, t, r),
                    tag: 'span',
                    classes: ['token', e.type],
                    attributes: {},
                    language: t,
                    parent: r,
                };
                if (e.alias) {
                    var i = 'Array' === n.util.type(e.alias) ? e.alias : [e.alias];
                    Array.prototype.push.apply(l.classes, i);
                }
                n.hooks.run('wrap', l);
                var o = Object.keys(l.attributes)
                    .map(function(e) {
                        return e + '="' + (l.attributes[e] || '').replace(/"/g, '&quot;') + '"';
                    })
                    .join(' ');
                return '<' + l.tag + ' class="' + l.classes.join(' ') + '"' + (o ? ' ' + o : '') + '>' + l.content + '</' + l.tag + '>';
            }),
            !_self.document)
        )
            return _self.addEventListener
                ? (n.disableWorkerMessageHandler ||
                      _self.addEventListener(
                          'message',
                          function(e) {
                              var t = JSON.parse(e.data),
                                  a = t.language,
                                  r = t.code,
                                  l = t.immediateClose;
                              _self.postMessage(n.highlight(r, n.languages[a], a)), l && _self.close();
                          },
                          !1
                      ),
                  _self.Prism)
                : _self.Prism;
        var r = document.currentScript || [].slice.call(document.getElementsByTagName('script')).pop();
        return (
            r &&
                ((n.filename = r.src),
                n.manual ||
                    r.hasAttribute('data-manual') ||
                    ('loading' !== document.readyState
                        ? window.requestAnimationFrame
                            ? window.requestAnimationFrame(n.highlightAll)
                            : window.setTimeout(n.highlightAll, 16)
                        : document.addEventListener('DOMContentLoaded', n.highlightAll))),
            _self.Prism
        );
    })();
'undefined' != typeof module && module.exports && (module.exports = Prism), 'undefined' != typeof global && (global.Prism = Prism);
(Prism.languages.markup = {
    comment: /<!--[\s\S]*?-->/,
    prolog: /<\?[\s\S]+?\?>/,
    doctype: /<!DOCTYPE[\s\S]+?>/i,
    cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
    tag: {
        pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,
        greedy: !0,
        inside: {
            tag: { pattern: /^<\/?[^\s>\/]+/i, inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ } },
            'attr-value': {
                pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i,
                inside: { punctuation: [/^=/, { pattern: /(^|[^\\])["']/, lookbehind: !0 }] },
            },
            punctuation: /\/?>/,
            'attr-name': { pattern: /[^\s>\/]+/, inside: { namespace: /^[^\s>\/:]+:/ } },
        },
    },
    entity: /&#?[\da-z]{1,8};/i,
}),
    (Prism.languages.markup.tag.inside['attr-value'].inside.entity = Prism.languages.markup.entity),
    Prism.hooks.add('wrap', function(a) {
        'entity' === a.type && (a.attributes.title = a.content.replace(/&amp;/, '&'));
    }),
    (Prism.languages.xml = Prism.languages.extend('markup', {})),
    (Prism.languages.html = Prism.languages.markup),
    (Prism.languages.mathml = Prism.languages.markup),
    (Prism.languages.svg = Prism.languages.markup);
(Prism.languages.css = {
    comment: /\/\*[\s\S]*?\*\//,
    atrule: { pattern: /@[\w-]+?[\s\S]*?(?:;|(?=\s*\{))/i, inside: { rule: /@[\w-]+/ } },
    url: /url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
    selector: /[^{}\s][^{};]*?(?=\s*\{)/,
    string: { pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: !0 },
    property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
    important: /!important\b/i,
    function: /[-a-z0-9]+(?=\()/i,
    punctuation: /[(){};:,]/,
}),
    (Prism.languages.css.atrule.inside.rest = Prism.languages.css),
    Prism.languages.markup &&
        (Prism.languages.insertBefore('markup', 'tag', {
            style: {
                pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
                lookbehind: !0,
                inside: Prism.languages.css,
                alias: 'language-css',
                greedy: !0,
            },
        }),
        Prism.languages.insertBefore(
            'inside',
            'attr-value',
            {
                'style-attr': {
                    pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
                    inside: {
                        'attr-name': { pattern: /^\s*style/i, inside: Prism.languages.markup.tag.inside },
                        punctuation: /^\s*=\s*['"]|['"]\s*$/,
                        'attr-value': { pattern: /.+/i, inside: Prism.languages.css },
                    },
                    alias: 'language-css',
                },
            },
            Prism.languages.markup.tag
        ));
Prism.languages.clike = {
    comment: [{ pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0 }, { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 }],
    string: { pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: !0 },
    'class-name': {
        pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
        lookbehind: !0,
        inside: { punctuation: /[.\\]/ },
    },
    keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    boolean: /\b(?:true|false)\b/,
    function: /\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
    punctuation: /[{}[\];(),.:]/,
};
(Prism.languages.javascript = Prism.languages.extend('clike', {
    'class-name': [
        Prism.languages.clike['class-name'],
        { pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/, lookbehind: !0 },
    ],
    keyword: [
        { pattern: /((?:^|})\s*)(?:catch|finally)\b/, lookbehind: !0 },
        /\b(?:as|async|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
    ],
    number: /\b(?:(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+)n?|\d+n|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
    function: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\(|\.(?:apply|bind|call)\()/,
    operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/,
})),
    (Prism.languages.javascript['class-name'][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/),
    Prism.languages.insertBefore('javascript', 'keyword', {
        regex: {
            pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^\/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,
            lookbehind: !0,
            greedy: !0,
        },
        'function-variable': {
            pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i,
            alias: 'function',
        },
        parameter: [
            {
                pattern: /(function(?:\s+[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)[^\s()][^()]*?(?=\s*\))/,
                lookbehind: !0,
                inside: Prism.languages.javascript,
            },
            { pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/, inside: Prism.languages.javascript },
            { pattern: /(\(\s*)[^\s()][^()]*?(?=\s*\)\s*=>)/, lookbehind: !0, inside: Prism.languages.javascript },
            {
                pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)[^\s()][^()]*?(?=\s*\)\s*\{)/,
                lookbehind: !0,
                inside: Prism.languages.javascript,
            },
        ],
        constant: /\b[A-Z][A-Z\d_]*\b/,
    }),
    Prism.languages.insertBefore('javascript', 'string', {
        'template-string': {
            pattern: /`(?:\\[\s\S]|\${[^}]+}|[^\\`])*`/,
            greedy: !0,
            inside: {
                interpolation: {
                    pattern: /\${[^}]+}/,
                    inside: { 'interpolation-punctuation': { pattern: /^\${|}$/, alias: 'punctuation' }, rest: Prism.languages.javascript },
                },
                string: /[\s\S]+/,
            },
        },
    }),
    Prism.languages.markup &&
        Prism.languages.insertBefore('markup', 'tag', {
            script: {
                pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
                lookbehind: !0,
                inside: Prism.languages.javascript,
                alias: 'language-javascript',
                greedy: !0,
            },
        }),
    (Prism.languages.js = Prism.languages.javascript);
(Prism.languages.csharp = Prism.languages.extend('clike', {
    keyword: /\b(?:abstract|add|alias|as|ascending|async|await|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|descending|do|double|dynamic|else|enum|event|explicit|extern|false|finally|fixed|float|for|foreach|from|get|global|goto|group|if|implicit|in|int|interface|internal|into|is|join|let|lock|long|namespace|new|null|object|operator|orderby|out|override|params|partial|private|protected|public|readonly|ref|remove|return|sbyte|sealed|select|set|short|sizeof|stackalloc|static|string|struct|switch|this|throw|true|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|value|var|virtual|void|volatile|where|while|yield)\b/,
    string: [
        { pattern: /@("|')(?:\1\1|\\[\s\S]|(?!\1)[^\\])*\1/, greedy: !0 },
        { pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*?\1/, greedy: !0 },
    ],
    'class-name': [
        { pattern: /\b[A-Z]\w*(?:\.\w+)*\b(?=\s+\w+)/, inside: { punctuation: /\./ } },
        { pattern: /(\[)[A-Z]\w*(?:\.\w+)*\b/, lookbehind: !0, inside: { punctuation: /\./ } },
        {
            pattern: /(\b(?:class|interface)\s+[A-Z]\w*(?:\.\w+)*\s*:\s*)[A-Z]\w*(?:\.\w+)*\b/,
            lookbehind: !0,
            inside: { punctuation: /\./ },
        },
        { pattern: /((?:\b(?:class|interface|new)\s+)|(?:catch\s+\())[A-Z]\w*(?:\.\w+)*\b/, lookbehind: !0, inside: { punctuation: /\./ } },
    ],
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)f?/i,
    operator: />>=?|<<=?|[-=]>|([-+&|?])\1|~|[-+*\/%&|^!=<>]=?/,
    punctuation: /\?\.?|::|[{}[\];(),.:]/,
})),
    Prism.languages.insertBefore('csharp', 'class-name', {
        'generic-method': {
            pattern: /\w+\s*<[^>\r\n]+?>\s*(?=\()/,
            inside: {
                function: /^\w+/,
                'class-name': { pattern: /\b[A-Z]\w*(?:\.\w+)*\b/, inside: { punctuation: /\./ } },
                keyword: Prism.languages.csharp.keyword,
                punctuation: /[<>(),.:]/,
            },
        },
        preprocessor: {
            pattern: /(^\s*)#.*/m,
            lookbehind: !0,
            alias: 'property',
            inside: {
                directive: {
                    pattern: /(\s*#)\b(?:define|elif|else|endif|endregion|error|if|line|pragma|region|undef|warning)\b/,
                    lookbehind: !0,
                    alias: 'keyword',
                },
            },
        },
    }),
    (Prism.languages.dotnet = Prism.languages.csharp);
!(function(e) {
    var t = {
        variable: [
            {
                pattern: /\$?\(\([\s\S]+?\)\)/,
                inside: {
                    variable: [{ pattern: /(^\$\(\([\s\S]+)\)\)/, lookbehind: !0 }, /^\$\(\(/],
                    number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee]-?\d+)?/,
                    operator: /--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,
                    punctuation: /\(\(?|\)\)?|,|;/,
                },
            },
            { pattern: /\$\([^)]+\)|`[^`]+`/, greedy: !0, inside: { variable: /^\$\(|^`|\)$|`$/ } },
            /\$(?:[\w#?*!@]+|\{[^}]+\})/i,
        ],
    };
    e.languages.bash = {
        shebang: { pattern: /^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/, alias: 'important' },
        comment: { pattern: /(^|[^"{\\])#.*/, lookbehind: !0 },
        string: [
            { pattern: /((?:^|[^<])<<\s*)["']?(\w+?)["']?\s*\r?\n(?:[\s\S])*?\r?\n\2/, lookbehind: !0, greedy: !0, inside: t },
            { pattern: /(["'])(?:\\[\s\S]|\$\([^)]+\)|`[^`]+`|(?!\1)[^\\])*\1/, greedy: !0, inside: t },
        ],
        variable: t.variable,
        function: {
            pattern: /(^|[\s;|&])(?:alias|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|hash|head|help|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|jobs|join|kill|killall|less|link|ln|locate|logname|logout|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|tail|tar|tee|test|time|timeout|times|top|touch|tr|traceroute|trap|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yes|zip|zypper)(?=$|[\s;|&])/,
            lookbehind: !0,
        },
        keyword: {
            pattern: /(^|[\s;|&])(?:let|:|\.|if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)(?=$|[\s;|&])/,
            lookbehind: !0,
        },
        boolean: { pattern: /(^|[\s;|&])(?:true|false)(?=$|[\s;|&])/, lookbehind: !0 },
        operator: /&&?|\|\|?|==?|!=?|<<<?|>>|<=?|>=?|=~/,
        punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];]/,
    };
    var a = t.variable[1].inside;
    (a.string = e.languages.bash.string),
        (a['function'] = e.languages.bash['function']),
        (a.keyword = e.languages.bash.keyword),
        (a['boolean'] = e.languages.bash['boolean']),
        (a.operator = e.languages.bash.operator),
        (a.punctuation = e.languages.bash.punctuation),
        (e.languages.shell = e.languages.bash);
})(Prism);
(Prism.languages.aspnet = Prism.languages.extend('markup', {
    'page-directive tag': {
        pattern: /<%\s*@.*%>/i,
        inside: {
            'page-directive tag': /<%\s*@\s*(?:Assembly|Control|Implements|Import|Master(?:Type)?|OutputCache|Page|PreviousPageType|Reference|Register)?|%>/i,
            rest: Prism.languages.markup.tag.inside,
        },
    },
    'directive tag': { pattern: /<%.*%>/i, inside: { 'directive tag': /<%\s*?[$=%#:]{0,2}|%>/i, rest: Prism.languages.csharp } },
})),
    (Prism.languages.aspnet.tag.pattern = /<(?!%)\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i),
    Prism.languages.insertBefore(
        'inside',
        'punctuation',
        { 'directive tag': Prism.languages.aspnet['directive tag'] },
        Prism.languages.aspnet.tag.inside['attr-value']
    ),
    Prism.languages.insertBefore('aspnet', 'comment', { 'asp comment': /<%--[\s\S]*?--%>/ }),
    Prism.languages.insertBefore('aspnet', Prism.languages.javascript ? 'script' : 'tag', {
        'asp script': {
            pattern: /(<script(?=.*runat=['"]?server['"]?)[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
            lookbehind: !0,
            inside: Prism.languages.csharp || {},
        },
    });
!(function(e) {
    var t = /#(?!\{).+/,
        n = { pattern: /#\{[^}]+\}/, alias: 'variable' };
    (e.languages.coffeescript = e.languages.extend('javascript', {
        comment: t,
        string: [
            { pattern: /'(?:\\[\s\S]|[^\\'])*'/, greedy: !0 },
            { pattern: /"(?:\\[\s\S]|[^\\"])*"/, greedy: !0, inside: { interpolation: n } },
        ],
        keyword: /\b(?:and|break|by|catch|class|continue|debugger|delete|do|each|else|extend|extends|false|finally|for|if|in|instanceof|is|isnt|let|loop|namespace|new|no|not|null|of|off|on|or|own|return|super|switch|then|this|throw|true|try|typeof|undefined|unless|until|when|while|window|with|yes|yield)\b/,
        'class-member': { pattern: /@(?!\d)\w+/, alias: 'variable' },
    })),
        e.languages.insertBefore('coffeescript', 'comment', {
            'multiline-comment': { pattern: /###[\s\S]+?###/, alias: 'comment' },
            'block-regex': { pattern: /\/{3}[\s\S]*?\/{3}/, alias: 'regex', inside: { comment: t, interpolation: n } },
        }),
        e.languages.insertBefore('coffeescript', 'string', {
            'inline-javascript': {
                pattern: /`(?:\\[\s\S]|[^\\`])*`/,
                inside: { delimiter: { pattern: /^`|`$/, alias: 'punctuation' }, rest: e.languages.javascript },
            },
            'multiline-string': [
                { pattern: /'''[\s\S]*?'''/, greedy: !0, alias: 'string' },
                { pattern: /"""[\s\S]*?"""/, greedy: !0, alias: 'string', inside: { interpolation: n } },
            ],
        }),
        e.languages.insertBefore('coffeescript', 'keyword', { property: /(?!\d)\w+(?=\s*:(?!:))/ }),
        delete e.languages.coffeescript['template-string'],
        (e.languages.coffee = e.languages.coffeescript);
})(Prism);
!(function(e) {
    e.languages.ruby = e.languages.extend('clike', {
        comment: [/#.*/, { pattern: /^=begin(?:\r?\n|\r)(?:.*(?:\r?\n|\r))*?=end/m, greedy: !0 }],
        keyword: /\b(?:alias|and|BEGIN|begin|break|case|class|def|define_method|defined|do|each|else|elsif|END|end|ensure|false|for|if|in|module|new|next|nil|not|or|protected|private|public|raise|redo|require|rescue|retry|return|self|super|then|throw|true|undef|unless|until|when|while|yield)\b/,
    });
    var n = { pattern: /#\{[^}]+\}/, inside: { delimiter: { pattern: /^#\{|\}$/, alias: 'tag' }, rest: e.languages.ruby } };
    delete e.languages.ruby.function,
        e.languages.insertBefore('ruby', 'keyword', {
            regex: [
                { pattern: /%r([^a-zA-Z0-9\s{(\[<])(?:(?!\1)[^\\]|\\[\s\S])*\1[gim]{0,3}/, greedy: !0, inside: { interpolation: n } },
                { pattern: /%r\((?:[^()\\]|\\[\s\S])*\)[gim]{0,3}/, greedy: !0, inside: { interpolation: n } },
                { pattern: /%r\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}[gim]{0,3}/, greedy: !0, inside: { interpolation: n } },
                { pattern: /%r\[(?:[^\[\]\\]|\\[\s\S])*\][gim]{0,3}/, greedy: !0, inside: { interpolation: n } },
                { pattern: /%r<(?:[^<>\\]|\\[\s\S])*>[gim]{0,3}/, greedy: !0, inside: { interpolation: n } },
                { pattern: /(^|[^\/])\/(?!\/)(\[.+?]|\\.|[^\/\\\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/, lookbehind: !0, greedy: !0 },
            ],
            variable: /[@$]+[a-zA-Z_]\w*(?:[?!]|\b)/,
            symbol: { pattern: /(^|[^:]):[a-zA-Z_]\w*(?:[?!]|\b)/, lookbehind: !0 },
            'method-definition': { pattern: /(\bdef\s+)[\w.]+/, lookbehind: !0, inside: { function: /\w+$/, rest: e.languages.ruby } },
        }),
        e.languages.insertBefore('ruby', 'number', {
            builtin: /\b(?:Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Stat|Fixnum|Float|Hash|Integer|IO|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|String|Struct|TMS|Symbol|ThreadGroup|Thread|Time|TrueClass)\b/,
            constant: /\b[A-Z]\w*(?:[?!]|\b)/,
        }),
        (e.languages.ruby.string = [
            { pattern: /%[qQiIwWxs]?([^a-zA-Z0-9\s{(\[<])(?:(?!\1)[^\\]|\\[\s\S])*\1/, greedy: !0, inside: { interpolation: n } },
            { pattern: /%[qQiIwWxs]?\((?:[^()\\]|\\[\s\S])*\)/, greedy: !0, inside: { interpolation: n } },
            { pattern: /%[qQiIwWxs]?\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}/, greedy: !0, inside: { interpolation: n } },
            { pattern: /%[qQiIwWxs]?\[(?:[^\[\]\\]|\\[\s\S])*\]/, greedy: !0, inside: { interpolation: n } },
            { pattern: /%[qQiIwWxs]?<(?:[^<>\\]|\\[\s\S])*>/, greedy: !0, inside: { interpolation: n } },
            { pattern: /("|')(?:#\{[^}]+\}|\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: !0, inside: { interpolation: n } },
        ]),
        (e.languages.rb = e.languages.ruby);
})(Prism);
(Prism.languages.docker = {
    keyword: {
        pattern: /(^\s*)(?:ADD|ARG|CMD|COPY|ENTRYPOINT|ENV|EXPOSE|FROM|HEALTHCHECK|LABEL|MAINTAINER|ONBUILD|RUN|SHELL|STOPSIGNAL|USER|VOLUME|WORKDIR)(?=\s)/im,
        lookbehind: !0,
    },
    string: /("|')(?:(?!\1)[^\\\r\n]|\\(?:\r\n|[\s\S]))*\1/,
    comment: /#.*/,
    punctuation: /---|\.\.\.|[:[\]{}\-,|>?]/,
}),
    (Prism.languages.dockerfile = Prism.languages.docker);
Prism.languages.hcl = {
    comment: /(?:\/\/|#).*|\/\*[\s\S]*?(?:\*\/|$)/,
    heredoc: { pattern: /<<-?(\w+)[\s\S]*?^\s*\1/m, greedy: !0, alias: 'string' },
    keyword: [
        {
            pattern: /(?:resource|data)\s+(?:"(?:\\[\s\S]|[^\\"])*")(?=\s+"[\w-]+"\s+{)/i,
            inside: { type: { pattern: /(resource|data|\s+)(?:"(?:\\[\s\S]|[^\\"])*")/i, lookbehind: !0, alias: 'variable' } },
        },
        {
            pattern: /(?:provider|provisioner|variable|output|module|backend)\s+(?:[\w-]+|"(?:\\[\s\S]|[^\\"])*")\s+(?={)/i,
            inside: {
                type: {
                    pattern: /(provider|provisioner|variable|output|module|backend)\s+(?:[\w-]+|"(?:\\[\s\S]|[^\\"])*")\s+/i,
                    lookbehind: !0,
                    alias: 'variable',
                },
            },
        },
        { pattern: /[\w-]+(?=\s+{)/ },
    ],
    property: [/[\w-\.]+(?=\s*=(?!=))/, /"(?:\\[\s\S]|[^\\"])+"(?=\s*[:=])/],
    string: {
        pattern: /"(?:[^\\$"]|\\[\s\S]|\$(?:(?=")|\$+|[^"${])|\$\{(?:[^{}"]|"(?:[^\\"]|\\[\s\S])*")*\})*"/,
        greedy: !0,
        inside: {
            interpolation: {
                pattern: /(^|[^$])\$\{(?:[^{}"]|"(?:[^\\"]|\\[\s\S])*")*\}/,
                lookbehind: !0,
                inside: {
                    type: {
                        pattern: /(\b(?:terraform|var|self|count|module|path|data|local)\b\.)[\w\*]+/i,
                        lookbehind: !0,
                        alias: 'variable',
                    },
                    keyword: /\b(?:terraform|var|self|count|module|path|data|local)\b/i,
                    function: /\w+(?=\()/,
                    string: { pattern: /"(?:\\[\s\S]|[^\\"])*"/, greedy: !0 },
                    number: /\b0x[\da-f]+|\d+\.?\d*(?:e[+-]?\d+)?/i,
                    punctuation: /[!\$#%&'()*+,.\/;<=>@\[\\\]^`{|}~?:]/,
                },
            },
        },
    },
    number: /\b0x[\da-f]+|\d+\.?\d*(?:e[+-]?\d+)?/i,
    boolean: /\b(?:true|false)\b/i,
    punctuation: /[=\[\]{}]/,
};
(Prism.languages.json = {
    comment: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
    property: { pattern: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/, greedy: !0 },
    string: { pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/, greedy: !0 },
    number: /-?\d+\.?\d*(e[+-]?\d+)?/i,
    punctuation: /[{}[\],]/,
    operator: /:/,
    boolean: /\b(?:true|false)\b/,
    null: /\bnull\b/,
}),
    (Prism.languages.jsonp = Prism.languages.json);
(Prism.languages.powershell = {
    comment: [{ pattern: /(^|[^`])<#[\s\S]*?#>/, lookbehind: !0 }, { pattern: /(^|[^`])#.*/, lookbehind: !0 }],
    string: [
        {
            pattern: /"(?:`[\s\S]|[^`"])*"/,
            greedy: !0,
            inside: { function: { pattern: /(^|[^`])\$\((?:\$\(.*?\)|(?!\$\()[^\r\n)])*\)/, lookbehind: !0, inside: {} } },
        },
        { pattern: /'(?:[^']|'')*'/, greedy: !0 },
    ],
    namespace: /\[[a-z](?:\[(?:\[[^\]]*]|[^\[\]])*]|[^\[\]])*]/i,
    boolean: /\$(?:true|false)\b/i,
    variable: /\$\w+\b/i,
    function: [
        /\b(?:Add-(?:Computer|Content|History|Member|PSSnapin|Type)|Checkpoint-Computer|Clear-(?:Content|EventLog|History|Item|ItemProperty|Variable)|Compare-Object|Complete-Transaction|Connect-PSSession|ConvertFrom-(?:Csv|Json|StringData)|Convert-Path|ConvertTo-(?:Csv|Html|Json|Xml)|Copy-(?:Item|ItemProperty)|Debug-Process|Disable-(?:ComputerRestore|PSBreakpoint|PSRemoting|PSSessionConfiguration)|Disconnect-PSSession|Enable-(?:ComputerRestore|PSBreakpoint|PSRemoting|PSSessionConfiguration)|Enter-PSSession|Exit-PSSession|Export-(?:Alias|Clixml|Console|Csv|FormatData|ModuleMember|PSSession)|ForEach-Object|Format-(?:Custom|List|Table|Wide)|Get-(?:Alias|ChildItem|Command|ComputerRestorePoint|Content|ControlPanelItem|Culture|Date|Event|EventLog|EventSubscriber|FormatData|Help|History|Host|HotFix|Item|ItemProperty|Job|Location|Member|Module|Process|PSBreakpoint|PSCallStack|PSDrive|PSProvider|PSSession|PSSessionConfiguration|PSSnapin|Random|Service|TraceSource|Transaction|TypeData|UICulture|Unique|Variable|WmiObject)|Group-Object|Import-(?:Alias|Clixml|Csv|LocalizedData|Module|PSSession)|Invoke-(?:Command|Expression|History|Item|RestMethod|WebRequest|WmiMethod)|Join-Path|Limit-EventLog|Measure-(?:Command|Object)|Move-(?:Item|ItemProperty)|New-(?:Alias|Event|EventLog|Item|ItemProperty|Module|ModuleManifest|Object|PSDrive|PSSession|PSSessionConfigurationFile|PSSessionOption|PSTransportOption|Service|TimeSpan|Variable|WebServiceProxy)|Out-(?:Default|File|GridView|Host|Null|Printer|String)|Pop-Location|Push-Location|Read-Host|Receive-(?:Job|PSSession)|Register-(?:EngineEvent|ObjectEvent|PSSessionConfiguration|WmiEvent)|Remove-(?:Computer|Event|EventLog|Item|ItemProperty|Job|Module|PSBreakpoint|PSDrive|PSSession|PSSnapin|TypeData|Variable|WmiObject)|Rename-(?:Computer|Item|ItemProperty)|Reset-ComputerMachinePassword|Resolve-Path|Restart-(?:Computer|Service)|Restore-Computer|Resume-(?:Job|Service)|Save-Help|Select-(?:Object|String|Xml)|Send-MailMessage|Set-(?:Alias|Content|Date|Item|ItemProperty|Location|PSBreakpoint|PSDebug|PSSessionConfiguration|Service|StrictMode|TraceSource|Variable|WmiInstance)|Show-(?:Command|ControlPanelItem|EventLog)|Sort-Object|Split-Path|Start-(?:Job|Process|Service|Sleep|Transaction)|Stop-(?:Computer|Job|Process|Service)|Suspend-(?:Job|Service)|Tee-Object|Test-(?:ComputerSecureChannel|Connection|ModuleManifest|Path|PSSessionConfigurationFile)|Trace-Command|Unblock-File|Undo-Transaction|Unregister-(?:Event|PSSessionConfiguration)|Update-(?:FormatData|Help|List|TypeData)|Use-Transaction|Wait-(?:Event|Job|Process)|Where-Object|Write-(?:Debug|Error|EventLog|Host|Output|Progress|Verbose|Warning))\b/i,
        /\b(?:ac|cat|chdir|clc|cli|clp|clv|compare|copy|cp|cpi|cpp|cvpa|dbp|del|diff|dir|ebp|echo|epal|epcsv|epsn|erase|fc|fl|ft|fw|gal|gbp|gc|gci|gcs|gdr|gi|gl|gm|gp|gps|group|gsv|gu|gv|gwmi|iex|ii|ipal|ipcsv|ipsn|irm|iwmi|iwr|kill|lp|ls|measure|mi|mount|move|mp|mv|nal|ndr|ni|nv|ogv|popd|ps|pushd|pwd|rbp|rd|rdr|ren|ri|rm|rmdir|rni|rnp|rp|rv|rvpa|rwmi|sal|saps|sasv|sbp|sc|select|set|shcm|si|sl|sleep|sls|sort|sp|spps|spsv|start|sv|swmi|tee|trcm|type|write)\b/i,
    ],
    keyword: /\b(?:Begin|Break|Catch|Class|Continue|Data|Define|Do|DynamicParam|Else|ElseIf|End|Exit|Filter|Finally|For|ForEach|From|Function|If|InlineScript|Parallel|Param|Process|Return|Sequence|Switch|Throw|Trap|Try|Until|Using|Var|While|Workflow)\b/i,
    operator: {
        pattern: /(\W?)(?:!|-(eq|ne|gt|ge|lt|le|sh[lr]|not|b?(?:and|x?or)|(?:Not)?(?:Like|Match|Contains|In)|Replace|Join|is(?:Not)?|as)\b|-[-=]?|\+[+=]?|[*\/%]=?)/i,
        lookbehind: !0,
    },
    punctuation: /[|{}[\];(),.]/,
}),
    (Prism.languages.powershell.string[0].inside.boolean = Prism.languages.powershell.boolean),
    (Prism.languages.powershell.string[0].inside.variable = Prism.languages.powershell.variable),
    (Prism.languages.powershell.string[0].inside.function.inside = Prism.languages.powershell);
(Prism.languages.scss = Prism.languages.extend('css', {
    comment: { pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/, lookbehind: !0 },
    atrule: { pattern: /@[\w-]+(?:\([^()]+\)|[^(])*?(?=\s+[{;])/, inside: { rule: /@[\w-]+/ } },
    url: /(?:[-a-z]+-)*url(?=\()/i,
    selector: {
        pattern: /(?=\S)[^@;{}()]?(?:[^@;{}()]|#\{\$[-\w]+\})+(?=\s*\{(?:\}|\s|[^}]+[:{][^}]+))/m,
        inside: { parent: { pattern: /&/, alias: 'important' }, placeholder: /%[-\w]+/, variable: /\$[-\w]+|#\{\$[-\w]+\}/ },
    },
    property: { pattern: /(?:[\w-]|\$[-\w]+|#\{\$[-\w]+\})+(?=\s*:)/, inside: { variable: /\$[-\w]+|#\{\$[-\w]+\}/ } },
})),
    Prism.languages.insertBefore('scss', 'atrule', {
        keyword: [
            /@(?:if|else(?: if)?|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)/i,
            { pattern: /( +)(?:from|through)(?= )/, lookbehind: !0 },
        ],
    }),
    Prism.languages.insertBefore('scss', 'important', { variable: /\$[-\w]+|#\{\$[-\w]+\}/ }),
    Prism.languages.insertBefore('scss', 'function', {
        placeholder: { pattern: /%[-\w]+/, alias: 'selector' },
        statement: { pattern: /\B!(?:default|optional)\b/i, alias: 'keyword' },
        boolean: /\b(?:true|false)\b/,
        null: /\bnull\b/,
        operator: { pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|or|not)(?=\s)/, lookbehind: !0 },
    }),
    (Prism.languages.scss.atrule.inside.rest = Prism.languages.scss);
(Prism.languages.typescript = Prism.languages.extend('javascript', {
    keyword: /\b(?:abstract|as|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|var|void|while|with|yield)\b/,
    builtin: /\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/,
})),
    (Prism.languages.ts = Prism.languages.typescript);
!(function(e) {
    (e.languages.sass = e.languages.extend('css', {
        comment: { pattern: /^([ \t]*)\/[\/*].*(?:(?:\r?\n|\r)\1[ \t]+.+)*/m, lookbehind: !0 },
    })),
        e.languages.insertBefore('sass', 'atrule', {
            'atrule-line': { pattern: /^(?:[ \t]*)[@+=].+/m, inside: { atrule: /(?:@[\w-]+|[+=])/m } },
        }),
        delete e.languages.sass.atrule;
    var t = /\$[-\w]+|#\{\$[-\w]+\}/,
        a = [/[+*\/%]|[=!]=|<=?|>=?|\b(?:and|or|not)\b/, { pattern: /(\s+)-(?=\s)/, lookbehind: !0 }];
    e.languages.insertBefore('sass', 'property', {
        'variable-line': { pattern: /^[ \t]*\$.+/m, inside: { punctuation: /:/, variable: t, operator: a } },
        'property-line': {
            pattern: /^[ \t]*(?:[^:\s]+ *:.*|:[^:\s]+.*)/m,
            inside: {
                property: [/[^:\s]+(?=\s*:)/, { pattern: /(:)[^:\s]+/, lookbehind: !0 }],
                punctuation: /:/,
                variable: t,
                operator: a,
                important: e.languages.sass.important,
            },
        },
    }),
        delete e.languages.sass.property,
        delete e.languages.sass.important,
        e.languages.insertBefore('sass', 'punctuation', {
            selector: { pattern: /([ \t]*)\S(?:,?[^,\r\n]+)*(?:,(?:\r?\n|\r)\1[ \t]+\S(?:,?[^,\r\n]+)*)*/, lookbehind: !0 },
        });
})(Prism);
!(function(e) {
    e.languages.pug = {
        comment: { pattern: /(^([\t ]*))\/\/.*(?:(?:\r?\n|\r)\2[\t ]+.+)*/m, lookbehind: !0 },
        'multiline-script': {
            pattern: /(^([\t ]*)script\b.*\.[\t ]*)(?:(?:\r?\n|\r(?!\n))(?:\2[\t ]+.+|\s*?(?=\r?\n|\r)))+/m,
            lookbehind: !0,
            inside: { rest: e.languages.javascript },
        },
        filter: {
            pattern: /(^([\t ]*)):.+(?:(?:\r?\n|\r(?!\n))(?:\2[\t ]+.+|\s*?(?=\r?\n|\r)))+/m,
            lookbehind: !0,
            inside: { 'filter-name': { pattern: /^:[\w-]+/, alias: 'variable' } },
        },
        'multiline-plain-text': {
            pattern: /(^([\t ]*)[\w\-#.]+\.[\t ]*)(?:(?:\r?\n|\r(?!\n))(?:\2[\t ]+.+|\s*?(?=\r?\n|\r)))+/m,
            lookbehind: !0,
        },
        markup: { pattern: /(^[\t ]*)<.+/m, lookbehind: !0, inside: { rest: e.languages.markup } },
        doctype: { pattern: /((?:^|\n)[\t ]*)doctype(?: .+)?/, lookbehind: !0 },
        'flow-control': {
            pattern: /(^[\t ]*)(?:if|unless|else|case|when|default|each|while)\b(?: .+)?/m,
            lookbehind: !0,
            inside: {
                each: { pattern: /^each .+? in\b/, inside: { keyword: /\b(?:each|in)\b/, punctuation: /,/ } },
                branch: { pattern: /^(?:if|unless|else|case|when|default|while)\b/, alias: 'keyword' },
                rest: e.languages.javascript,
            },
        },
        keyword: { pattern: /(^[\t ]*)(?:block|extends|include|append|prepend)\b.+/m, lookbehind: !0 },
        mixin: [
            {
                pattern: /(^[\t ]*)mixin .+/m,
                lookbehind: !0,
                inside: { keyword: /^mixin/, function: /\w+(?=\s*\(|\s*$)/, punctuation: /[(),.]/ },
            },
            {
                pattern: /(^[\t ]*)\+.+/m,
                lookbehind: !0,
                inside: { name: { pattern: /^\+\w+/, alias: 'function' }, rest: e.languages.javascript },
            },
        ],
        script: { pattern: /(^[\t ]*script(?:(?:&[^(]+)?\([^)]+\))*[\t ]+).+/m, lookbehind: !0, inside: { rest: e.languages.javascript } },
        'plain-text': { pattern: /(^[\t ]*(?!-)[\w\-#.]*[\w\-](?:(?:&[^(]+)?\([^)]+\))*\/?[\t ]+).+/m, lookbehind: !0 },
        tag: {
            pattern: /(^[\t ]*)(?!-)[\w\-#.]*[\w\-](?:(?:&[^(]+)?\([^)]+\))*\/?:?/m,
            lookbehind: !0,
            inside: {
                attributes: [
                    { pattern: /&[^(]+\([^)]+\)/, inside: { rest: e.languages.javascript } },
                    {
                        pattern: /\([^)]+\)/,
                        inside: {
                            'attr-value': {
                                pattern: /(=\s*)(?:\{[^}]*\}|[^,)\r\n]+)/,
                                lookbehind: !0,
                                inside: { rest: e.languages.javascript },
                            },
                            'attr-name': /[\w-]+(?=\s*!?=|\s*[,)])/,
                            punctuation: /[!=(),]+/,
                        },
                    },
                ],
                punctuation: /:/,
            },
        },
        code: [{ pattern: /(^[\t ]*(?:-|!?=)).+/m, lookbehind: !0, inside: { rest: e.languages.javascript } }],
        punctuation: /[.\-!=|]+/,
    };
    for (
        var t = '(^([	 ]*)):{{filter_name}}(?:(?:\r?\n|\r(?!\n))(?:\\2[	 ]+.+|\\s*?(?=\r?\n|\r)))+',
            n = [
                { filter: 'atpl', language: 'twig' },
                { filter: 'coffee', language: 'coffeescript' },
                'ejs',
                'handlebars',
                'hogan',
                'less',
                'livescript',
                'markdown',
                'mustache',
                'plates',
                { filter: 'sass', language: 'scss' },
                'stylus',
                'swig',
            ],
            a = {},
            i = 0,
            r = n.length;
        r > i;
        i++
    ) {
        var s = n[i];
        (s = 'string' == typeof s ? { filter: s, language: s } : s),
            e.languages[s.language] &&
                (a['filter-' + s.filter] = {
                    pattern: RegExp(t.replace('{{filter_name}}', s.filter), 'm'),
                    lookbehind: !0,
                    inside: { 'filter-name': { pattern: /^:[\w-]+/, alias: 'variable' }, rest: e.languages[s.language] },
                });
    }
    e.languages.insertBefore('pug', 'filter', a);
})(Prism);
(Prism.languages.yaml = {
    scalar: {
        pattern: /([\-:]\s*(?:![^\s]+)?[ \t]*[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)[^\r\n]+(?:\2[^\r\n]+)*)/,
        lookbehind: !0,
        alias: 'string',
    },
    comment: /#.*/,
    key: { pattern: /(\s*(?:^|[:\-,[{\r\n?])[ \t]*(?:![^\s]+)?[ \t]*)[^\r\n{[\]},#\s]+?(?=\s*:\s)/, lookbehind: !0, alias: 'atrule' },
    directive: { pattern: /(^[ \t]*)%.+/m, lookbehind: !0, alias: 'important' },
    datetime: {
        pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)(?:\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?)?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?)(?=[ \t]*(?:$|,|]|}))/m,
        lookbehind: !0,
        alias: 'number',
    },
    boolean: { pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)(?:true|false)[ \t]*(?=$|,|]|})/im, lookbehind: !0, alias: 'important' },
    null: { pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)(?:null|~)[ \t]*(?=$|,|]|})/im, lookbehind: !0, alias: 'important' },
    string: {
        pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)("|')(?:(?!\2)[^\\\r\n]|\\.)*\2(?=[ \t]*(?:$|,|]|}|\s*#))/m,
        lookbehind: !0,
        greedy: !0,
    },
    number: {
        pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+\.?\d*|\.?\d+)(?:e[+-]?\d+)?|\.inf|\.nan)[ \t]*(?=$|,|]|})/im,
        lookbehind: !0,
    },
    tag: /![^\s]+/,
    important: /[&*][\w]+/,
    punctuation: /---|[:[\]{}\-,|>?]|\.\.\./,
}),
    (Prism.languages.yml = Prism.languages.yaml);
!(function() {
    if ('undefined' != typeof self && self.Prism && self.document) {
        var t = [],
            e = {},
            n = function() {};
        Prism.plugins.toolbar = {};
        var a = (Prism.plugins.toolbar.registerButton = function(n, a) {
                var o;
                (o =
                    'function' == typeof a
                        ? a
                        : function(t) {
                              var e;
                              return (
                                  'function' == typeof a.onClick
                                      ? ((e = document.createElement('button')),
                                        (e.type = 'button'),
                                        e.addEventListener('click', function() {
                                            a.onClick.call(this, t);
                                        }))
                                      : 'string' == typeof a.url
                                      ? ((e = document.createElement('a')), (e.href = a.url))
                                      : (e = document.createElement('span')),
                                  (e.textContent = a.text),
                                  e
                              );
                          }),
                    t.push((e[n] = o));
            }),
            o = (Prism.plugins.toolbar.hook = function(a) {
                var o = a.element.parentNode;
                if (o && /pre/i.test(o.nodeName) && !o.parentNode.classList.contains('code-toolbar')) {
                    var r = document.createElement('div');
                    r.classList.add('code-toolbar'), o.parentNode.insertBefore(r, o), r.appendChild(o);
                    var i = document.createElement('div');
                    i.classList.add('toolbar'),
                        document.body.hasAttribute('data-toolbar-order') &&
                            (t = document.body
                                .getAttribute('data-toolbar-order')
                                .split(',')
                                .map(function(t) {
                                    return e[t] || n;
                                })),
                        t.forEach(function(t) {
                            var e = t(a);
                            if (e) {
                                var n = document.createElement('div');
                                n.classList.add('toolbar-item'), n.appendChild(e), i.appendChild(n);
                            }
                        }),
                        r.appendChild(i);
                }
            });
        a('label', function(t) {
            var e = t.element.parentNode;
            if (e && /pre/i.test(e.nodeName) && e.hasAttribute('data-label')) {
                var n,
                    a,
                    o = e.getAttribute('data-label');
                try {
                    a = document.querySelector('template#' + o);
                } catch (r) {}
                return (
                    a
                        ? (n = a.content)
                        : (e.hasAttribute('data-url')
                              ? ((n = document.createElement('a')), (n.href = e.getAttribute('data-url')))
                              : (n = document.createElement('span')),
                          (n.textContent = o)),
                    n
                );
            }
        }),
            Prism.hooks.add('complete', o);
    }
})();
!(function() {
    if ('undefined' != typeof self && self.Prism && self.document) {
        if (!Prism.plugins.toolbar) return console.warn('Show Languages plugin loaded before Toolbar plugin.'), void 0;
        var e = {
            html: 'HTML',
            xml: 'XML',
            svg: 'SVG',
            mathml: 'MathML',
            css: 'CSS',
            clike: 'C-like',
            js: 'JavaScript',
            abap: 'ABAP',
            apacheconf: 'Apache Configuration',
            apl: 'APL',
            arff: 'ARFF',
            asciidoc: 'AsciiDoc',
            adoc: 'AsciiDoc',
            asm6502: '6502 Assembly',
            aspnet: 'ASP.NET (C#)',
            autohotkey: 'AutoHotkey',
            autoit: 'AutoIt',
            shell: 'Bash',
            basic: 'BASIC',
            csharp: 'C#',
            dotnet: 'C#',
            cpp: 'C++',
            cil: 'CIL',
            csp: 'Content-Security-Policy',
            'css-extras': 'CSS Extras',
            django: 'Django/Jinja2',
            jinja2: 'Django/Jinja2',
            dockerfile: 'Docker',
            erb: 'ERB',
            fsharp: 'F#',
            gcode: 'G-code',
            gedcom: 'GEDCOM',
            glsl: 'GLSL',
            gml: 'GameMaker Language',
            gamemakerlanguage: 'GameMaker Language',
            graphql: 'GraphQL',
            hcl: 'HCL',
            http: 'HTTP',
            hpkp: 'HTTP Public-Key-Pins',
            hsts: 'HTTP Strict-Transport-Security',
            ichigojam: 'IchigoJam',
            inform7: 'Inform 7',
            javastacktrace: 'Java stack trace',
            json: 'JSON',
            jsonp: 'JSONP',
            latex: 'LaTeX',
            emacs: 'Lisp',
            elisp: 'Lisp',
            'emacs-lisp': 'Lisp',
            lolcode: 'LOLCODE',
            'markup-templating': 'Markup templating',
            matlab: 'MATLAB',
            mel: 'MEL',
            n1ql: 'N1QL',
            n4js: 'N4JS',
            n4jsd: 'N4JS',
            'nand2tetris-hdl': 'Nand To Tetris HDL',
            nasm: 'NASM',
            nginx: 'nginx',
            nsis: 'NSIS',
            objectivec: 'Objective-C',
            ocaml: 'OCaml',
            opencl: 'OpenCL',
            parigp: 'PARI/GP',
            objectpascal: 'Object Pascal',
            php: 'PHP',
            'php-extras': 'PHP Extras',
            plsql: 'PL/SQL',
            powershell: 'PowerShell',
            properties: '.properties',
            protobuf: 'Protocol Buffers',
            q: 'Q (kdb+ database)',
            jsx: 'React JSX',
            tsx: 'React TSX',
            renpy: "Ren'py",
            rest: 'reST (reStructuredText)',
            sas: 'SAS',
            sass: 'Sass (Sass)',
            scss: 'Sass (Scss)',
            sql: 'SQL',
            soy: 'Soy (Closure Template)',
            tap: 'TAP',
            toml: 'TOML',
            tt2: 'Template Toolkit 2',
            ts: 'TypeScript',
            vbnet: 'VB.Net',
            vhdl: 'VHDL',
            vim: 'vim',
            'visual-basic': 'Visual Basic',
            vb: 'Visual Basic',
            wasm: 'WebAssembly',
            wiki: 'Wiki markup',
            xeoracube: 'XeoraCube',
            xojo: 'Xojo (REALbasic)',
            xquery: 'XQuery',
            yaml: 'YAML',
        };
        Prism.plugins.toolbar.registerButton('show-language', function(a) {
            function s(e) {
                return e ? (e.substring(0, 1).toUpperCase() + e.substring(1)).replace(/s(?=cript)/, 'S') : e;
            }
            var t = a.element.parentNode;
            if (t && /pre/i.test(t.nodeName)) {
                var o = t.getAttribute('data-language') || e[a.language] || s(a.language);
                if (o) {
                    var i = document.createElement('span');
                    return (i.textContent = o), i;
                }
            }
        });
    }
})();
