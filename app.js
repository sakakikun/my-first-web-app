const express = require("express");
const mysql = require("mysql2");
const app = express();
const path = require("path"); // Node.jsの標準モジュールを読み込み

// EJSをテンプレートエンジンとして設定
app.set("view engine", "ejs");
// ビューファイル（.ejsファイル）があるディレクトリを設定
app.set("views", path.join(__dirname, "views"));
// POSTリクエストのフォームデータを解析するための設定
// これにより、フォームデータが req.body で使えるようになります
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ren_3377_SakakI", // ログイン時に使用したパスワード
  database: "practice_db", // 接続したいデータベース名
});

connection.connect((err) => {
  if (err) {
    console.error("MySQL接続エラー:", err.stack);
    // 接続できない場合はアプリを終了させるなどの対応を検討
    return;
  }
  console.log("✅ MySQLに接続しました");
});

app.get("/", (req, res) => {
  res.render("top.ejs");
});

app.get("/index", (req, res) => {
  res.render("index.ejs");
});

app.get("/new", (req, res) => {
  res.render("new.ejs");
});

app.get("/users", (req, res) => {
  connection.query("SELECT * FROM users", (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.render("users.ejs", { users: results });
  });
});

// server.js (ルーティングのブロックに追加)

// フォームからのデータを受け取り、データベースに保存するルート
app.post("/create", (req, res) => {
  // フォームから送られたデータは req.body に入っています
  // new.ejsで name="name", name="email", name="password" と指定した値を取り出します
  const { name, email, password } = req.body;

  // SQLインジェクションを防ぐため、安全なプリペアドステートメントの記法を使用
  const query =
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)";

  // ※本来はここでパスワードをハッシュ化しますが、今回は練習のためそのまま使用
  const passwordHash = password;

  // クエリ実行
  connection.query(query, [name, email, passwordHash], (error, results) => {
    if (error) {
      console.error("ユーザー登録エラー:", error);
      // ユーザーにエラーメッセージを返す
      return res.status(500).send("ユーザー登録中にエラーが発生しました。");
    }

    // 登録が成功したら、ユーザー一覧ページにリダイレクトして確認させる
    res.redirect("/users");
  });
});

// 編集フォームを表示するルート
// URLの:idの部分が「パラメータ」として取得されます
app.get("/edit/:id", (req, res) => {
  // URLパラメータからユーザーIDを取得
  const userId = req.params.id;
  const query = "SELECT * FROM users WHERE id = ?";
  // 指定されたIDのユーザー情報をデータベースから取得
  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (results.length === 0) {
      res.status(404).send("User not found");
      return;
    }
    // 取得したユーザー情報を編集フォームに渡して表示
    res.render("edit.ejs", { user: results[0] });
  });
});

// データ更新処理を実行するルート
app.post("/update/:id", (req, res) => {
  // 1. 更新対象のIDを取得
  const userId = req.params.id;
  // 2. フォームからの新しいデータを取得
  const { name, email, password } = req.body;

  let query = "";
  let params = [];

  // パスワードが入力されているかどうかでSQL文を分ける
  if (password) {
    // パスワードも更新する場合
    query =
      "UPDATE users SET name = ?, email = ?, password_hash = ? WHERE id = ?";
    params = [name, email, password, userId];
  } else {
    // パスワードは更新しない場合
    query = "UPDATE users SET name = ?, email = ? WHERE id = ?";
    params = [name, email, userId];
  }

  connection.query(query, params, (error, results) => {
    if (error) {
      console.error("ユーザー更新エラー:", error);
      return res
        .status(500)
        .send("ユーザー情報の更新中にエラーが発生しました。");
    }

    // 更新が成功したら、ユーザー一覧ページにリダイレクト
    res.redirect("/users");
  });
});

// データの削除処理を実行するルート
// 削除処理もデータ変更を伴うため、POSTメソッドを使います
app.post("/delete/:id", (req, res) => {
  // 1. 削除対象のIDを取得
  const userId = req.params.id;

  // 2. SQLクエリを準備
  const query = "DELETE FROM users WHERE id = ?";

  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error("ユーザー削除エラー:", error);
      return res.status(500).send("ユーザーの削除中にエラーが発生しました。");
    }

    // 削除が成功したら、ユーザー一覧ページにリダイレクト
    res.redirect("/users");
  });
});

app.listen(3000);
