<script>
  import { db } from "./firebase";
  import {
    onSnapshot,
    collection,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
  } from "firebase/firestore";
  import Toastify from "toastify-js";

  let task = {
    title: "",
    description: "",
  };

  let tasks = [];
  let inputElement;

  let editStatus = false;
  let currentId = "";

  onSnapshot(
    collection(db, "tasks"),
    (querySnapshot) => {
      tasks = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    },
    (err) => {
      console.error(err);
    }
  );

  const addTask = async () => {
    try {
      await addDoc(collection(db, "tasks"), {
        ...task,
        createdAt: Date.now(),
      });
      Toastify({
        text: "New Task created",
      }).showToast();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (error) {
      console.error(error);
    }
  };

  const editTask = (currenTask) => {
    currentId = currenTask.id;
    task.title = currenTask.title;
    task.description = currenTask.description;

    editStatus = true;
  };

  const updateTask = async () => {
    try {
      await updateDoc(doc(db, "tasks", currentId), task);
      Toastify({
        text: "Task updated",
      }).showToast();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = () => {
    if (!task.title) return;

    if (!editStatus) {
      addTask();
    } else {
      updateTask();
      editStatus = false;
      currentId = "";
    }

    task = { title: "", description: "" };
    inputElement.focus();
  };

  const onCancel = () => {
    editStatus = false;
    currentId = "";
    task = { title: "", description: "" };
  };
</script>

<!-- TEMPLATE -->
<div class="container p-4">
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <!-- Task Form -->
      <form on:submit|preventDefault={handleSubmit} class="card card-body p-5">
        <div class="mb-3">
          <label for="title" class="fs-5 text-secondary">Title</label>
          <input
            type="text"
            bind:value={task.title}
            bind:this={inputElement}
            placeholder="My important task"
            class="form-control"
          />
        </div>

        <div class="mb-2">
          <label for="description" class="fs-5 text-secondary"
            >Description</label
          >
          <textarea
            bind:value={task.description}
            rows="3"
            placeholder="Write a Task Description"
            class="form-control"
          />
        </div>

        <div class="d-flex gap-2 mt-2">
          <button class="btn btn-primary btn-sm d-flex" disabled={!task.title}>
            <i class="material-icons">save</i>
            <span class="ms-2">
              {#if !editStatus}Save{:else}Update{/if}
            </span>
          </button>
          {#if editStatus}
            <button on:click={onCancel} class="btn btn-info btn-sm"
              >Cancel</button
            >
          {/if}
        </div>
      </form>

      <!-- Render all Tasks -->
      {#each tasks as task}
        <div class="card card-body mt-2">
          <div class="d-flex justify-content-between">
            <h5>{task.title}</h5>
            <i
              class="material-icons"
              style="vertical-align:middle;"
              on:click={editTask(task)}
            >
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

<style>
</style>
