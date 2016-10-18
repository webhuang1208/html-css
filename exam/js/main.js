/**
 * Created by Administrator on 2016/9/22.
 */
$(function(){
        //实现左侧导航动画
        $(".baseUI>li>ul").slideUp();
        $(".baseUI>li>a").on("click",function(){
                $(".baseUI>li>ul").slideUp();
                $(this).next().slideDown();
        });

        $(".baseUI>li>a:eq(0)").trigger("click");
        $(".baseUI>li>ul>li>a:eq(0)").trigger("click");
        //点击导航中的子项目清除class,并给当前项目添加class:current
        $(".baseUI>li>ul>li").on("click",function(){
            $(".baseUI>li>ul>li").removeClass();
            $(this).addClass("current");
        });
})
//创建主模块并导入路由和app.subject子模块
angular.module("app",["ng","ngRoute","app.subject","app.paper"])
    .controller("mainCtrl",["$scope",function($scope){

    }]).config(["$routeProvider",function($routeProvider){
                /*
                * a 类型id
                *   b 难度
                *   c 方向
                *  d 知识点*/
                $routeProvider.when("/AllSubject/a/:a/b/:b/c/:c/d/:d",{
                    templateUrl:"tpl/subject/allText1-1.html",
                    controller:"subjectController"
                }).when("/SubjectAdd",{
                    templateUrl:"tpl/subject/addText1-3.html",
                    controller:"subjectController"
                 }).when("/SubjectDel/id/:id",{
                    templateUrl:"tpl/subject/allText1-1.html",
                    controller:"subjectDelController"
                }).when("/SubjectCheck/id/:id/state/:state",{
                    templateUrl:"tpl/subject/allText1-1.html",
                    controller:"subjectCheckController"
                }).when("/PaperList",{
                    templateUrl:"tpl/examManage/examList.html",
                    controller:"paperListController"
                }).when("/PaperAdd/id/:id/stem/:stem/type/:type/topic/:topic/level/:level",{
                    templateUrl:"tpl/examManage/createExam.html",
                    controller:"paperAddController"
                }).when("/PaperSubjectList",{
                    templateUrl:"tpl/examManage/createExam.html",
                    controller:"subjectController"
                }).when("/AllSubjectAdd",{
                    templateUrl:"tpl/examManage/addPaper.html",
                    controller:"subjectController"
                });
}])
