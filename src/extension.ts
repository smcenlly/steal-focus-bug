import * as vscode from "vscode";
import * as path from "path";

export async function activate(context: vscode.ExtensionContext) {
  const ctrl = vscode.tests.createTestController(
    "steal-focus-bug",
    "steal-focus-bug"
  );

  let numberOfLines = 1;
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (path.basename(e.document.uri.fsPath) === "test.txt") {
        if (!ctrl.items.get("test")) {
          ctrl.items.add(ctrl.createTestItem("test", "test", e.document.uri));
        }

        if (e.document.lineCount !== numberOfLines) {
          numberOfLines = e.document.lineCount;

          const testItem = ctrl.items.get("test") as vscode.TestItem;
          const testRun = ctrl.createTestRun(
            new vscode.TestRunRequest(),
            "steal-focus-bug",
            false
          );
          const errorMessage = new vscode.TestMessage("Something went wrong");
          errorMessage.location = new vscode.Location(
            e.document.uri,
            new vscode.Position(0, 0)
          );
          testRun.failed(testItem, [errorMessage], 1);
          testRun.end();
        }
      }
    })
  );
}
