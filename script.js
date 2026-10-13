
// ==================== 获取书写页面元素 ====================
const titleInput = document.getElementById("note-title");
const contentInput = document.getElementById("note-content");
const saveButton = document.getElementById("save-record");
const saveNoteButton = document.getElementById("save-note");

// ==================== 保存算法记录 ====================
if (saveButton && titleInput && contentInput) {
    saveButton.addEventListener("click", function () {
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (title === "" && content === "") {
            alert("先写点内容再保存吧！");
            return;
        }

        const records = JSON.parse(
            localStorage.getItem("records") || "[]"
        );

        const now = new Date();

        records.push({
            title: title,
            content: content,
            date: now.toLocaleDateString(),
            createdAt: now.getTime()
        });

        localStorage.setItem("records", JSON.stringify(records));

        alert("保存成功！");
    });
}

// ==================== 保存日常随笔 ====================
if (saveNoteButton && titleInput && contentInput) {
    saveNoteButton.addEventListener("click", function () {
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (title === "" && content === "") {
            alert("先写点内容再保存吧！");
            return;
        }

        const notes = JSON.parse(
            localStorage.getItem("dailyNotes") || "[]"
        );

        const now = new Date();

        notes.push({
            title: title,
            content: content,
            date: now.toLocaleDateString(),
            createdAt: now.getTime()
        });

        localStorage.setItem("dailyNotes", JSON.stringify(notes));

        alert("随笔保存成功！");
        window.location.href = "notes.html";
    });
}

// ==================== 算法记录列表 ====================
const recordList = document.getElementById("record-list");

if (recordList) {
    const records = JSON.parse(
        localStorage.getItem("records") || "[]"
    );

    records.sort(function (a, b) {
        const timeA = a.createdAt || new Date(a.date).getTime();
        const timeB = b.createdAt || new Date(b.date).getTime();
        return timeB - timeA;
    });

    records.forEach(function (record, index) {
        const article = document.createElement("article");

        const date = document.createElement("p");
        date.textContent = record.date;

        const title = document.createElement("h2");
        title.textContent = record.title || "未命名记录";
        title.style.cursor = "pointer";

        title.addEventListener("click", function () {
            localStorage.setItem("currentRecordIndex", index);
            window.location.href = "detail.html";
        });

        article.append(date, title);
        recordList.appendChild(article);
    });
}

// ==================== 日常随笔列表 ====================
const noteList = document.getElementById("note-list");

if (noteList) {
    const notes = JSON.parse(
        localStorage.getItem("dailyNotes") || "[]"
    );

    notes.sort(function (a, b) {
        return (b.createdAt || 0) - (a.createdAt || 0);
    });

    notes.forEach(function (note, index) {
        const article = document.createElement("article");

        const date = document.createElement("p");
        date.textContent = note.date;

        const title = document.createElement("h2");
        title.textContent = note.title || "未命名随笔";
        title.style.cursor = "pointer";

        title.addEventListener("click", function () {
            localStorage.setItem("currentNoteIndex", index);
            window.location.href = "note-detail.html";
        });

        article.append(date, title);
        noteList.appendChild(article);
    });
}

// ==================== 算法记录详情页 ====================
const detailTitle = document.getElementById("detail-title");
const detailDate = document.getElementById("detail-date");
const detailContent = document.getElementById("detail-content");
const editButton = document.getElementById("edit-record");
const deleteButton = document.getElementById("delete-record");

// 只有算法详情页的编辑、删除按钮存在时，才运行算法详情逻辑
if (
    detailTitle &&
    detailDate &&
    detailContent &&
    editButton &&
    deleteButton
) {
    const records = JSON.parse(
        localStorage.getItem("records") || "[]"
    );

    records.sort(function (a, b) {
        const timeA = a.createdAt || new Date(a.date).getTime();
        const timeB = b.createdAt || new Date(b.date).getTime();
        return timeB - timeA;
    });

    const index = Number(
        localStorage.getItem("currentRecordIndex")
    );

    const record = records[index];

    if (record) {
        detailTitle.textContent = record.title || "未命名记录";
        detailDate.textContent = record.date;
        detailContent.textContent = record.content;
        detailContent.style.whiteSpace = "pre-wrap";

        editButton.addEventListener("click", function () {
            if (editButton.textContent === "保存修改") {
                const newTitle = document.getElementById("edit-title").value.trim();
                const newContent = document.getElementById("edit-content").value;

                if (newTitle === "" && newContent.trim() === "") {
                    alert("标题和正文不能都为空！");
                    return;
                }

                record.title = newTitle;
                record.content = newContent;

                localStorage.setItem("records", JSON.stringify(records));
                location.reload();
                return;
            }

            const newTitleInput = document.createElement("input");
            newTitleInput.id = "edit-title";
            newTitleInput.value = record.title;
            newTitleInput.placeholder = "标题";

            const newContentInput = document.createElement("textarea");
            newContentInput.id = "edit-content";
            newContentInput.value = record.content;
            newContentInput.placeholder = "正文";

            detailTitle.replaceWith(newTitleInput);
            detailContent.replaceWith(newContentInput);

            editButton.textContent = "保存修改";
        });

        deleteButton.addEventListener("click", function () {
            if (!confirm("确定要删除这篇记录吗？删除后无法恢复。")) {
                return;
            }

            records.splice(index, 1);
            localStorage.setItem("records", JSON.stringify(records));
            window.location.href = "algorithm.html";
        });
    } else {
        detailTitle.textContent = "没有找到这篇记录";
        detailDate.textContent = "";
        detailContent.textContent = "";
        editButton.style.display = "none";
        deleteButton.style.display = "none";
    }
}

// ==================== 日常随笔详情页 ====================
const noteDetailTitle = document.getElementById("detail-title");
const noteDetailDate = document.getElementById("detail-date");
const noteDetailContent = document.getElementById("detail-content");
const editNoteButton = document.getElementById("edit-note");
const deleteNoteButton = document.getElementById("delete-note");

// 只有随笔详情页的专属按钮存在时，才运行随笔详情逻辑
if (
    noteDetailTitle &&
    noteDetailDate &&
    noteDetailContent &&
    editNoteButton &&
    deleteNoteButton
) {
    const notes = JSON.parse(
        localStorage.getItem("dailyNotes") || "[]"
    );

    notes.sort(function (a, b) {
        return (b.createdAt || 0) - (a.createdAt || 0);
    });

    const index = Number(
        localStorage.getItem("currentNoteIndex")
    );

    const note = notes[index];

    if (note) {
        noteDetailTitle.textContent = note.title || "未命名随笔";
        noteDetailDate.textContent = note.date;
        noteDetailContent.textContent = note.content;
        noteDetailContent.style.whiteSpace = "pre-wrap";

        // 编辑随笔 / 保存修改
        editNoteButton.addEventListener("click", function () {
            if (editNoteButton.textContent === "保存修改") {
                const titleEditor = document.getElementById("edit-note-title");
                const contentEditor = document.getElementById("edit-note-content");

                if (!titleEditor || !contentEditor) {
                    alert("编辑框没有找到，请刷新页面重试。");
                    return;
                }

                const newTitle = titleEditor.value.trim();
                const newContent = contentEditor.value;

                if (newTitle === "" && newContent.trim() === "") {
                    alert("标题和正文不能都为空！");
                    return;
                }

                note.title = newTitle;
                note.content = newContent;

                localStorage.setItem("dailyNotes", JSON.stringify(notes));

                alert("随笔修改成功！");
                location.reload();
                return;
            }

            const titleEditor = document.createElement("input");
            titleEditor.id = "edit-note-title";
            titleEditor.className = "note-editor-title";
            titleEditor.value = note.title || "";
            titleEditor.placeholder = "随笔标题";
            titleEditor.style.width = "100%";
            titleEditor.style.boxSizing = "border-box";

            const contentEditor = document.createElement("textarea");
            contentEditor.id = "edit-note-content";
            contentEditor.className = "note-editor-content";
            contentEditor.value = note.content || "";
            contentEditor.placeholder = "随笔正文";
            contentEditor.style.width = "100%";
            contentEditor.style.minHeight = "300px";
            contentEditor.style.boxSizing = "border-box";

            noteDetailTitle.replaceWith(titleEditor);
            noteDetailContent.replaceWith(contentEditor);

            editNoteButton.textContent = "保存修改";
            titleEditor.focus();
        });

        // 删除随笔
        deleteNoteButton.addEventListener("click", function () {
            if (!confirm("确定要删除这篇随笔吗？删除后无法恢复。")) {
                return;
            }

            notes.splice(index, 1);
            localStorage.setItem("dailyNotes", JSON.stringify(notes));

            alert("随笔已删除！");
            window.location.href = "notes.html";
        });
    } else {
        noteDetailTitle.textContent = "没有找到这篇随笔";
        noteDetailDate.textContent = "";
        noteDetailContent.textContent = "";
        editNoteButton.style.display = "none";
        deleteNoteButton.style.display = "none";
    }
}

// ==================== 关于我页面编辑功能 ====================
const aboutTitle = document.getElementById("about-title");
const aboutContent = document.getElementById("about-content");
const editAboutButton = document.getElementById("edit-about");
const saveAboutButton = document.getElementById("save-about");

if (aboutTitle && aboutContent && editAboutButton && saveAboutButton) {
    // 读取之前保存的介绍
    const savedAbout = JSON.parse(
        localStorage.getItem("aboutMe") || "null"
    );

    if (savedAbout) {
        aboutTitle.textContent = savedAbout.title;
        aboutContent.innerHTML = "";

        savedAbout.paragraphs.forEach(function (paragraph) {
            const p = document.createElement("p");
            p.textContent = paragraph;
            aboutContent.appendChild(p);
        });
    }

    // 点击编辑
    editAboutButton.addEventListener("click", function () {
        const titleInput = document.createElement("input");
        titleInput.id = "about-title-input";
        titleInput.value = aboutTitle.textContent;
        titleInput.className = "note-editor-title";

        const contentInput = document.createElement("textarea");
        contentInput.id = "about-content-input";
        contentInput.value = Array.from(aboutContent.querySelectorAll("p"))
            .map(function (p) {
                return p.textContent;
            })
            .join("\n\n");
        contentInput.className = "note-editor-content";

        aboutTitle.replaceWith(titleInput);
        aboutContent.replaceWith(contentInput);

        editAboutButton.style.display = "none";
        saveAboutButton.style.display = "inline-block";
    });

    // 点击保存
    saveAboutButton.addEventListener("click", function () {
        const titleInput = document.getElementById("about-title-input");
        const contentInput = document.getElementById("about-content-input");

        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (!title && !content) {
            alert("先写点介绍内容吧！");
            return;
        }

        const paragraphs = content
            .split(/\n\s*\n/)
            .map(function (text) {
                return text.trim();
            })
            .filter(Boolean);

        localStorage.setItem("aboutMe", JSON.stringify({
            title: title || "关于我",
            paragraphs: paragraphs
        }));

        location.reload();
    });
}
