function(e) {
                var t = e.isDraggable
                  , n = e.onDragCallback
                  , r = e.onDragEndCallback
                  , o = e.containerRef
                  , a = e.heightRef
                  , c = e.preventScrollingRef
                  , u = e.isContentScrolledRef
                  , l = e.onDismiss
                  , s = e.handleFindSnap
                  , d = e.minSnap
                  , f = e.maxSnap
                  , v = e.maxHeight
                  , m = i.a.useRef(null)
                  , p = i.a.useRef(0)
                  , g = i.a.useRef(0)
                  , w = i.a.useRef(!1);
                return {
                    onTouchStart: (function(e, n) {
                        t && (p.current = e.touches[0].pageY),
                        n && (c.current = !u.current && a.current < f)
                    }
                    ),
                    onTouchMove: (function(e, r) {
                        var i = o.current;
                        t && i && (!r || !u.current) && (m.current = requestAnimationFrame((function() {
                            g.current = e.touches[0].pageY;
                            var t = g.current - (p.current || 0);
                            if (w.current || (w.current = Math.abs(t) > 1),
                            w.current) {
                                var o = a.current - t;
                                r ? (o >= f ? i.style.height = h(f) : i.style.height = h(o),
                                c.current = o < f) : (c.current = !1,
                                i.style.height = h(o)),
                                n && n({
                                    height: o,
                                    maxHeight: v,
                                    minSnap: d,
                                    maxSnap: f
                                })
                            }
                        }
                        )))
                    }
                    ),
                    onTouchEnd: (function(e) {
                        var n = o.current;
                        if (t && w.current && a.current && n) {
                            w.current = !1,
                            m.current && cancelAnimationFrame(m.current);
                            var i = p.current || 0
                              , c = (g.current || 0) - i
                              , u = .25 * d
                              , b = a.current
                              , R = b - c;
                            a.current = R;
                            var O = 0;
                            if (R > f)
                                O = f;
                            else if (b === d && R < d && c > u || b > d && R < u) {
                                if ("function" == typeof l)
                                    return l();
                                O = d
                            } else
                                O = s((function(e) {
                                    return e.height
                                }
                                ));
                            a.current = O,
                            n.style.height = h(O),
                            r && r({
                                height: O,
                                maxHeight: v,
                                minSnap: d,
                                maxSnap: f
                            }),
                            p.current = 0
                        }
                    }
                    )
                }
            }