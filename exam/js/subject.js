/**
 * Created by Administrator on 2016/9/22.
 */

angular.module("app.subject",["ng","ngRoute"])
    .controller("subjectCheckController",["$routeParams","examService","$location",function($routeParams,examService,$location){
                examService.checkSubject($routeParams.id,$routeParams.state,function(data){
                        alert("审核成功！");
                        $location.path("/AllSubject/a/0/b/0/c/0/d/0");
                })
    }])
    .controller("subjectDelController",["$routeParams","examService","$location",function($routeParams,examService,$location){
        var flag=confirm("确定删除吗？");
        if(flag){
            var id=$routeParams.id;
            examService.delSubject(id,function(data){
                alert("删除成功");
                $location.path("/AllSubject/a/0/b/0/c/0/d/0");
            })
        }else{
            $location.path("/AllSubject/a/0/b/0/c/0/d/0");
        }

    }])
    .controller("subjectController",["$scope","$routeParams","examService","$location",function($scope,$routeParams,examService,$location){
           //获取到参数并且传给params
            $scope.params=$routeParams;
            examService.getAllTypes(function(data){
                $scope.types=data;
            });
            examService.getAllLevels(function(data){
                $scope.levels=data;
            });
            examService.getAllDepartments(function(data){
                $scope.departments=data;
            });
            examService.getAllTopics(function(data){
                $scope.topics=data;
            });
            examService.getAllExams($routeParams,function(data){
                $scope.exams=data;
                data.forEach(function(subject){
                    var answer=[];
                    subject.choices.forEach(function(choice,index){
                        choice.no=examService.coverIndexNo(index);
                    });
                    if(subject.subjectType){
                        if(subject.subjectType.id!=3){
                            subject.choices.forEach(function(choice){
                                if(choice.correct==true){
                                    answer.push(choice.no);
                                };
                            });
                        };
                    }

                    subject.answer=answer.toString();
                })
            }
            )
            $scope.subject={
                typeId:3,
                levelId:1,
                departmentId:1,
                topicId:1,
                stem:"",
                answer:"",  //简答题答案
                fx:"",
                choiceContent:[],
                choiceCorrect:[false,false,false,false]
            };
            //调用保存题目方法并且绑定给’保存并继续‘一个点击事件
            $scope.submit=function(){
                examService.saveSubject($scope.subject,function(data){

                });
                var subject={
                    typeId:3,
                    levelId:1,
                    departmentId:1,
                    topicId:1,
                    stem:"",
                    answer:"",  //简答题答案
                    fx:"",
                    choiceContent:[],
                    choiceCorrect:[false,false,false,false]
                };
                angular.copy(subject,$scope.subject);




            };
            $scope.goBack=function(){
                examService.saveSubject($scope.subject,function(data){

                });
                $location.path("/AllSubject/a/0/b/0/c/0/d/0");
            }
}]).factory("examService",function($http,$httpParamSerializer){
            return{
                getAllTypes:function(handler){
                    $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action").success(function(data){
                    //$http.get("data/type.json").success(function(data){
                        handler(data);
                    })
                },
                getAllLevels:function(handler){
                    $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action").success(function(data){
                    //$http.get("data/level.json").success(function(data){
                        handler(data);
                    })
                },
                getAllDepartments:function(handler){
                    $http.get("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action").success(function(data){
                    //$http.get("data/department.json").success(function(data){
                        handler(data);
                    })
                },
                getAllTopics:function(handler){
                    $http.get("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action").success(function(data){
                    //$http.get("data/topic.json").success(function(data){
                        handler(data);
                    })
                },
                getAllExams:function(params,handler){
                        //创建一个对象保存参数
                        var data={};
                        for(var key in params){
                            var val=params[key];
                            if(val!=0){
                                switch(key){
                                    case "a":
                                        data['subject.subjectType.id']=val;
                                        break;
                                    case "b":
                                        data['subject.subjectLevel.id']=val;
                                        break;
                                    case "c":
                                        data['subject.department.id']=val;
                                        break;
                                    case "d":
                                        data['subject.topic.id']=val;
                                        break;
                                }
                            }

                        }
                    $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action",{
                        params:data
                    }).success(function(data){
                     //$http.get("data/exam.json").success(function(data){
                        handler(data);
                    })
                },
                coverIndexNo:function(index){
                     if(index==0){
                            return "A"
                    }else if(index==1){
                            return "B"
                     }else if(index==2){
                            return "C"
                     }else{
                            return "D"
                     }
                },
                saveSubject:function(params,handler){
                    var obj={};
                    for(var key in params){
                        var val=params[key];
                        switch(key){
                            case "typeId":
                                obj['subject.subjectType.id']=val;
                                break;
                            case "levelId":
                                obj['subject.subjectLevel.id']=val;
                                break;
                            case "topicId":
                                obj['subject.topic.id']=val;
                                break;
                            case "departmentId":
                                obj['subject.department.id'] = val;
                                break;
                            case "stem":
                                obj['subject.stem']=val;
                                break;
                            case "fx":
                                obj['subject.analysis']=val;
                                break;
                            case "answer":
                                obj['subject.answer'] = val;
                                break;
                        }
                    }
                    obj=$httpParamSerializer(obj);
                    $http.post("http://172.16.0.5:7777/test/exam/manager/saveStudent.action",obj,{
                        headers:{
                            "Content-Type":"application/x-www-form-urlencoded"
                        }
                    }).success(function(data){
                        handler(data);
                    })
                },
                delSubject:function(id,handler){
                    $http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action",{
                        params:{
                            'subject.id':id
                        }
                    }).success(function(data){
                            handler(data)
                    })
                },
                checkSubject:function(id,state,handler){
                    $http.get("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",{
                        params:{
                            'subject.id':id,
                            "subject.checkState":state
                        }
                    }).success(function(data){
                        handler(data)
                    })
                }


    }

}).filter("selectTopics",function(){
        return function(input,id){
            if(input){
                //filter是给定一个函数，返回满足该函数的元素
                var result=input.filter(function(item){
                    return item.department.id==id;  //判断参数id是否等于当前遍历元素的方向id，是则保存在result中
                });
                return result;
            }
        }
}).directive("selectOption",function(){
    return{
        restrict:"A",
        link:function(scope,element){
                element.on("change",function(){
                        var val=element.val();
                        var type=element.attr("type");
                        var chec=$(this).prop("checked");
                        if(type=="radio"){
                            scope.subject.choiceCorrect=[false,false,false,false];
                            for(var i=0;i<4;i++){
                                if(i==val){
                                    scope.subject.choiceCorrect[i]=true;
                                }
                            }
                        }else if(type=="checkbox"){
                            for(var i=0;i<4;i++){
                                if(i==val){
                                    chec==false?scope.subject.choiceCorrect[i]=false:scope.subject.choiceCorrect[i]=true;
                                }
                            }
                        }

                        scope.$digest();
                })

        }
    }
})
