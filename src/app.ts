import { ulid } from "../node_modules/ulid/dist/ulid"
import { STATUS_MAP, statuses } from "./constants"
import { Task } from "./types"

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
    this.form.addEventListener("submit", this.addTask.bind(this))
    this.appContainer.addEventListener("click", this.handleClick.bind(this))

    this.render()
  }

  private addTask(e: Event) {
    e.preventDefault()

    const content = this.input.value.trim()
    if (!content) return

    this.tasks.push({
      id: ulid(),
      content,
      status: statuses[0],
    })

    this.input.value = ""
    this.render()
  }

  private handleClick(e: Event) {
    const target = e.target as HTMLElement
    if (target.tagName !== "LI") return

    const taskId = target.dataset.id
    const task = this.tasks.find((task) => task.id === taskId)

    if (!task) return

    switch (task.status) {
      case "todo":
        task.status = "doing"
        break
      case "doing":
        task.status = "done"
        break
      case "done":
        this.tasks = this.tasks.filter((task) => task.id !== taskId)
        break
    }

    this.render()
  }

  private render() {
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
