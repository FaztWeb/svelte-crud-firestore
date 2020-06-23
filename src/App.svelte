<script>
  import { timingSafeEqual } from "crypto";

  import { db } from "./firebase.js";
  import toastr from "toastr";

  let task = {
    name: "",
    description: "",
  };

  let tasks = [];
  let inputElement;

  let editStatus = false;
  let currentId = "";

  db.collection("tasks")
    .orderBy("createdAt", "asc")
    .onSnapshot((querySnapshot) => {
      let docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      tasks = [...docs];
      console.log(tasks);
    });

  const addTask = async () => {
    try {
      await db
        .collection("tasks")
        .doc()
        .set({ ...task, createdAt: Date.now() });
      console.log("new Task created");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    await db.collection("tasks").doc(id).delete();
  };

  const editTask = (currenTask) => {
    currentId = currenTask.id;
    task.name = currenTask.name;
    task.description = currenTask.description;

    editStatus = true;
  };

  const updateTask = async () => {
    await db.collection("tasks").doc(currentId).update(task);
    toastr.success("Product Updated Successfully", "", {
      timeOut: 1000,
      progressBar: true,
      positionClass: "toast-bottom-right",
    });
  };

  const handleSubmit = () => {
    if (!task.name) return;

    if (!editStatus) {
      addTask();
    } else {
      updateTask();
      editStatus = false;
      currentId = "";
    }

    task = { name: "", description: "" };
    inputElement.focus();
  };

  const onCancel = () => {
    editStatus = false;
    currentId = "";
    task = { name: "", description: "" };
  };
</script>

<style>

</style>

<!-- TEMPLATE -->
<div class="container p-4">
  <div class="row">
    <div class="col-md-4 offset-md-4">
      <form on:submit|preventDefault={handleSubmit} class="card card-body">
        <div class="form-group">
          <input
            type="text"
            bind:value={task.name}
            bind:this={inputElement}
            placeholder="Write a new Task"
            class="form-control" />
        </div>

        <div class="form-group">
          <textarea
            bind:value={task.description}
            rows="3"
            placeholder="Write a Task Description"
            class="form-control" />
        </div>

        <div class="ml-auto mt-1">
          <button class="btn btn-primary">
            <i class="material-icons" style="vertical-align:middle;">save</i>
            <span style="vertical-align:middle">
              {#if !editStatus}Save{:else}Update{/if}
            </span>
          </button>
          {#if editStatus}
            <button on:click={onCancel} class="btn btn-info">Cancel</button>
          {/if}
        </div>
      </form>

      {#each tasks as task}
        <div class="card card-body mt-2">
          <div class="d-flex justify-content-between">
            <h5>{task.name}</h5>
            <i
              class="material-icons"
              style="vertical-align:middle;"
              on:click={editTask(task)}>
              edit
            </i>
          </div>
          <p>{task.description}</p>
          <div>
            <button on:click={deleteTask(task.id)} class="btn btn-danger">
              <i class="material-icons" style="vertical-align:middle;">
                delete_forever
              </i>
              <span style="vertical-align:middle;">Delete</span>
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
