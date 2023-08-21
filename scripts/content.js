// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


let animations = document.getElementsByClassName("zb-button  primary  raised           start-button start-graphic");
console.log("fortnite balls");

setInterval(function() {
  animations = document.getElementsByClassName("zb-button  primary  raised           start-button start-graphic");
  console.log(animations);
  for (let i = 0; i < animations.length; i++) {
    console.log(animations.item(i));
    animations.item(i).click();
  }
  second_buttons = document.getElementsByClassName("play-button  bounce");
  console.log(second_buttons);
  for (let i = 0; i < second_buttons.length; i++) {
    console.log(second_buttons.item(i));
    second_buttons.item(i).click();
  }
  show_a_buttons = document.getElementsByClassName("zb-button  secondary             show-answer-button");
  console.log(show_a_buttons);
  for (let i = 0; i < show_a_buttons.length; i++) {
    console.log(show_a_buttons.item(i));
    show_a_buttons.item(i).click();
    show_a_buttons.item(i).click();
  }

}, 5000);






// for(animation_button in animations){
//   console.log(animation_button);
//   // animation_div.click();
// }

