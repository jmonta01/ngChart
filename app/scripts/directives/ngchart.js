'use strict';

/**
 * @ngdoc directive
 * @name ngChartApp.directive:ngChart
 * @description
 * # ngChart
 */
angular.module('ngChartApp')
    .directive('ngChart', ['d3', 'under', '$window',
        function (d3, under, $window) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    data: '=',
                    bounds: '=',
                    fields: '=',
                    labelFns: '='
                },
                template: '<div class="chart"></div>',
                link: function postLink(scope, element) {

                    var w = angular.element($window);
                    var margin = { left: 30, top: 30, right: 30, bottom: 30 };
                    var svg, grid, chart, bars, xScale, yScale, line;


                    function render (data) {
                        if (!svg) {
                            svg = d3.select(element[0]).append('svg');
                            xScale = d3.scale.linear();
                            yScale = d3.scale.linear();
                        }

                        svg.attr('width', getWidth()).attr('height', getHeight());

                        xScale.range([chartXStart(), chartXEnd()])
                            .domain([scope.bounds.x.min, scope.bounds.x.max]);

                        yScale.range([chartYEnd(), chartYStart()])
                            .domain([scope.bounds.y.min, scope.bounds.y.max]);


//                        renderMarginTest();

                        renderAxes();
                        renderChart(data);
                    }

                    function renderAxes () {
                        if (!grid) {
                            grid = svg.append('g').attr('class', 'grid');
                        }

                        //Render X Axis
                        var xAxis = d3.svg.axis()
                            .scale(xScale)
                            .outerTickSize(0)
                            .tickPadding(0)
//                            .tickFormat(function (d) {
//                                return scope.labelFns.x(d);
//                            })
                            .orient('bottom');

                        grid.selectAll('g.x-axis').remove();

                        grid.append('g')
                            .attr('class', 'x-axis')
                            .attr('stroke', 1)
                            .attr('transform', 'translate(0, ' + chartYEnd() + ')')
                            .call(xAxis);

                        grid.selectAll('g.x-axis g.tick')
                            .append('line')
                            .classed('grid-line', true)
                            .attr('x1', 0)
                            .attr('x2', 0)
                            .attr('y1', 0)
                            .attr('y2', - chartHeight());

                        //Render Y Axis
                        var yAxis = d3.svg.axis()
                            .scale(yScale)
                            .outerTickSize(0)
                            .tickPadding(0)
                            .ticks(10)
//                            .tickFormat(function (d) {
//                                return scope.labelFns.y(d);
//                            })
                            .orient('left');

                        grid.selectAll('g.y-axis').remove();

                        grid.append('g')
                            .attr('class', 'y-axis')
                            .attr('transform', 'translate(' + chartXStart() + ', 0)')
                            .call(yAxis);

                        grid.selectAll('g.y-axis g.tick')
                            .append('line')
                            .classed('grid-line', true)
                            .attr('x1', 0)
                            .attr('x2', chartWidth())
                            .attr('y1', 0)
                            .attr('y1', 0);
                    }

                    function renderChart (data) {
                        if (!chart) {
                            chart = svg.append('g').attr('class', 'body');
                        }

                        renderBarChart(data);
                        renderLineChart(data);
                    }

                    function renderLineChart (data) {
                        var line = d3.svg.line()
                            .x(function (d, i) {
                                return xScale(d[scope.fields.x]);
                            })
                            .y(function (d) {
                                return yScale(d[scope.fields.y]);
                            });


                        chart.selectAll("path.line").remove();

                        chart.selectAll('path.line')
                            .append("path")
                            .attr('class', 'line')
                            .data(data)
                            .enter();


                        chart.selectAll('path.line')
                            .data(data)
                            .attr("d", line(data));
                    }

                    function renderBarChart (data) {

                        var barWidth = chartWidth() / data.length - 2;

                        if (!bars) {
                            bars = chart.append('g').attr('class', 'bars');
                        }

                        bars.selectAll('rect.bar')
                            .data(data)
                            .enter()
                                .append('rect')
                                    .attr('class', 'bar')
                                    .attr('x', function (d, i) {
                                        return xScale(d[scope.fields.x]) - barWidth/2;
                                    })
                                    .attr('y', chartYEnd())
                                    .attr('width', barWidth)
                                    .attr('height', 0);

                        bars.selectAll('rect.bar')
                            .data(data)
                            .transition()
                            .duration(250)
                            .delay(function (d, i) {
                                return i * 10;
                            })
                                .attr('x', function (d, i) {
                                    return xScale(d[scope.fields.x]) - barWidth/2;
                                })
                                .attr('y', function (d, i) {
                                    return yScale(d[scope.fields.y]);
                                })
                                .attr('width', barWidth)
                                .attr('height', function (d, i) {
                                    return chartYEnd() - yScale(d[scope.fields.y]);
                                });

                    }


                    function renderMarginTest () {
                        var tests = [
                            {x: 0, y: 0, w: margin.left, h: margin.top, fill: '#ff0000'},
                            {x: getWidth() - margin.right, y: 0, w: margin.right, h: margin.top, fill: '#00ff00'},
                            {x: getWidth() - margin.right, y: getHeight() - margin.bottom, w: margin.right, h: margin.bottom, fill: '#0000ff'},
                            {x: 0, y: getHeight() - margin.bottom, w: margin.left, h: margin.bottom, fill: '#ffff00'}
                        ];

                        svg.selectAll('rect.tester').remove();

                        svg.selectAll('rect.tester')
                            .data(tests)
                            .enter()
                            .append('rect')
                            .classed('tester', true);

                        svg.selectAll('rect.tester')
                            .data(tests)
                            .attr('fill', function (d, i) {
                                return d.fill;
                            })
                            .attr('width', function (d) {
                                return d.w;
                            })
                            .attr('height', function (d) {
                                return d.h;
                            })
                            .attr('x', function (d) {
                                return d.x;
                            })
                            .attr('y', function (d) {
                                return d.y;
                            });

                    }


                    //Data util functions
                    function getExtent (data, prop) {
                        return d3.extent(under.map(data, function (item) {
                            return item[prop];
                        }));
                    }


                    //Layout util functions
                    function chartXStart () {
                        return margin.left;
                    }

                    function chartXEnd () {
                        return chartWidth() + chartXStart();
                    }

                    function chartYStart () {
                        return margin.top;
                    }

                    function chartYEnd () {
                        return chartHeight() + chartYStart();
                    }

                    function chartWidth () {
                        return getWidth() - margin.right - margin.left;
                    }

                    function chartHeight () {
                        return getHeight() - margin.top - margin.bottom;
                    }

                    function getWidth () {
                        return element.parent().width();
                    }

                    function getHeight () {
                        return 500;
                    }




                    scope.$watch('data', function () {
                        render(scope.data);
                    }, true);

                    w.bind('resize', function () {
                        if (svg) {
                            render(scope.data);
                        }
                    });

                }
            };
        }
    ]);
