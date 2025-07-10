import { STATUS_MAP, statuses } from "./constants.js"
import { Task } from "./types.js"

class App {
  private tasks: Task[] = []

  //DOM要素
  private appContainer: HTMLDivElement
  private form: HTMLFormElement
  private input: HTMLInputElement

  //テンプレート要素
  private taskListTemplate: HTMLTemplateElement
  private taskItemTemplate: HTMLTemplateElement

  constructor() {
    //DOM要素の取得
    this.appContainer = document.getElementById("app") as HTMLDivElement
    this.form = document.querySelector("form") as HTMLFormElement
    this.input = document.querySelector("input") as HTMLInputElement

    //テンプレートの取得
    this.taskListTemplate = document.getElementById(
      "task-list-template"
    ) as HTMLTemplateElement
    this.taskItemTemplate = document.getElementById(
      "task-item-template"
    ) as HTMLTemplateElement

    //イベントリスナーの設定
    this.form.addEventListener("submit", this.addTask)
    this.appContainer.addEventListener("click", this.handleClick)

    this.render()
  }

  private addTask = (e: Event) => {
    e.preventDefault()

    const content = this.input.value.trim()
    if (!content) return

    this.tasks.push({
      id: crypto.randomUUID(),
      content,
      status: statuses[0],
    })

    this.input.value = ""

    this.render()
  }

  private handleClick = (e: Event) => {
    const target = e.target as HTMLElement
    if (target.tagName !== "LI") return

    const taskId = target.dataset.id
    const task = this.tasks.find((task) => task.id === taskId)

    if (!task) return

    //現在のstatusが、配列statusesの何番目に当たるのかを探す
    const currentIndex = statuses.findIndex((status) => status === task.status)

    const nextIndex = currentIndex + 1

    //次のstatusが存在するか（配列の範囲内か）をチェック
    if (nextIndex < statuses.length) {
      //次のstatusを代入
      task.status = statuses[nextIndex]
    } else {
      //最後のstatusの場合、タスクを削除する
      this.tasks = this.tasks.filter((task) => task.id !== taskId)
    }

    this.render()
  }

  private render = () => {
    //コンテナをクリア
    this.appContainer.innerHTML = ""

    //タスクリストの複製
    statuses.forEach((status) => {
      const taskListClone = this.taskListTemplate.content.cloneNode(
        true
      ) as DocumentFragment
      const h2 = taskListClone.querySelector("h2")!
      const ul = taskListClone.querySelector("ul")!

      //見出しを設定
      h2.textContent = STATUS_MAP[status].label

      //ステータスでフィルタリング
      const filteredTasks = this.tasks.filter((task) => task.status === status)

      //タスクをリストに追加
      filteredTasks.forEach((task) => {
        const taskItemClone = this.taskItemTemplate.content.cloneNode(
          true
        ) as DocumentFragment
        const li = taskItemClone.querySelector("li")!

        li.textContent = task.content
        li.dataset.id = task.id.toString()

        ul.appendChild(li)
      })

      this.appContainer.appendChild(taskListClone)
    })
  }
}

new App()
