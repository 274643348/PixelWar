const { ccclass } = cc._decorator;

@ccclass
export default class MyHttp extends cc.Component {
  private url = "http://118.25.145.236:3000/login";
  public xhr = new XMLHttpRequest();

  onLoad() {
    this.xhr.onreadystatechange = () => {
      if (
        this.xhr.readyState == 4 &&
        (this.xhr.status >= 200 && this.xhr.status < 400)
      ) {
        let response = this.xhr.responseText;
        console.log(response);
      }
    };
  }
  login() {
    this.xhr.open("GET", this.url, false, "ljy", "123456");

    //构造表单数据
    // let formData = new FormData();

    // formData.append("username", "ljy");
    // formData.append("id", "123456");
    this.xhr.send("");
  }
}
