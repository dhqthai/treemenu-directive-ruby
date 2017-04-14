/**
 * Created by dhqthai on 4/13/17.
 */
'use strict';
var mainApp = angular.module('mainApp');

mainApp.directive('treeview', ['$timeout', function($timeout){
    return {
        restrict: 'E',
        templateUrl: 'phishing_creator/templates/partials/_treeview_template.html',
        link: function($scope, element, attrs) {
            $scope.data = JSON.parse(attrs.data);
            $scope.template = attrs.template;

            $scope.treemenu = function(options) {
                options = options || {};
                options.delay = options.delay || 0;
                options.openActive = options.openActive || false;
                options.closeOther = options.closeOther || false;
                options.activeSelector = options.activeSelector || ".active";

                this.addClass("treemenu");

                if (!options.nonroot) {
                    this.addClass("treemenu-root");
                }

                options.nonroot = true;

                this.find("> li").each(function() {
                    e = $(this);
                    var subtree = e.find('> ul');
                    var button = e.find('.toggler').eq(0);

                    if(button.length == 0) {
                        // create toggler
                        var button = $('<span>');
                        button.addClass('toggler');
                        e.prepend(button);
                    }

                    if(subtree.length > 0) {
                        subtree.hide();

                        e.addClass('tree-closed');

                        e.find(button).click(function() {
                            var li = $(this).parent('li');

                            if (options.closeOther && li.hasClass('tree-closed')) {
                                var siblings = li.parent('ul').find("li:not(.tree-empty)");
                                siblings.removeClass("tree-opened");
                                siblings.addClass("tree-closed");
                                siblings.removeClass(options.activeSelector);
                                siblings.find('> ul').slideUp(options.delay);
                            }

                            li.find('> ul').slideToggle(options.delay);
                            li.toggleClass('tree-opened');
                            li.toggleClass('tree-closed');
                            li.toggleClass(options.activeSelector);
                        });

                        $(this).find('> ul').treemenu(options);
                    } else {
                        $(this).addClass('tree-empty');
                    }
                });

                if (options.openActive) {
                    var cls = this.attr("class");

                    this.find(options.activeSelector).each(function(){
                        var el = $(this).parent();

                        while (el.attr("class") !== cls) {
                            el.find('> ul').show();
                            if(el.prop("tagName") === 'UL') {
                                el.show();
                            } else if (el.prop("tagName") === 'LI') {
                                el.removeClass('tree-closed');
                                el.addClass("tree-opened");
                                el.show();
                            }

                            el = el.parent();
                        }
                    });
                }

                return this;
            };

            // Draw expand collapse for tree view
            $timeout(function(){
                angular.element('.tree_view_checkbox').treemenu({
                    'delay': 100,
                    'activeSelector': 'active'

                }).openActive();
            }, 100);
        }
    };
}]).filter('getIconClass', function(){
    return function(input){
        if (input != undefined){
            return input.split(' ')[0].toLowerCase() + '-icon';
        } else {
            return 'cluster-icon';
        }
    }
});
