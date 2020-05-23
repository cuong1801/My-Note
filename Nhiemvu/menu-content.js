var app = angular.module("TaskList", ["ngAnimate"]);

app.controller("taskController", [
  "$scope",
  function($scope) {
    // Setup array with a couple default tasks
    $scope.tasks = [
      { title: "A default item", done: false },
      { title: "A completed default item", done: true }
    ];
    // Add new tasks
    $scope.addTask = function() {
      $scope.tasks.push({ title: $scope.newTask, done: false });
      $scope.newTask = "";
    };
    // Clear completed tasks
    $scope.clearCompleted = function() {
      $scope.tasks = $scope.tasks.filter(function(task) {
        return !task.done;
      });
    };
  }
]);
