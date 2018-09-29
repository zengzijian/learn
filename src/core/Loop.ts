import {AsyncQueue} from "./AsyncQueue";
import {app3d} from "../3d/main3d";
import {AsyncList} from "./AsyncQueue1";

function LOOP() {
    requestAnimationFrame(LOOP);

    // if(AsyncQueue.length > 0) {
    //     // console.log("执行异步队列中的方法啦～");
    //     // AsyncQueue.push(app3d.activeRender);
    //     AsyncQueue.forEach((fn:Function) => {
    //         fn();
    //     });
    //     AsyncQueue.length = 0;
    // }

    for(let i in AsyncList) {
        let typeArr = AsyncList[i];

        switch(i) {
            case "dom":
            case "always":
                if(typeArr.length > 0) {
                    runAllFn(typeArr);
                }
                break;
            case "three":
                if(typeArr.length > 0 ) {
                    // todo push 3d render function
                    runAllFn(typeArr);
                }
                break;
            case "two":
                if(typeArr.length > 0) {
                    // todo push 2d render function
                    runAllFn(typeArr);
                }
        }
    }
}

function runAllFn(arr:Array<Function>) {
    arr.forEach((fn:Function) => {
        fn();
    });
    arr.length = 0;
}

export {LOOP};