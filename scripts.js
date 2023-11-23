
import { html, createOrderHtml, updateDraggingHtml,updateNewDragging, moveToColumn } from "./view.js";
let orders = []
/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event 
 */
const handleDragOver = (event) => {
    event.preventDefault();
    const path = event.path || event.composedPath()
    let column = null

    for (const element of path) {
        const { area } = element.dataset
        if (area) {
            column = area
            break;
        }
    }

    if (!column) return
    updateNewDragging({ over: column })
    updateDraggingHtml({ over: column })
}


const handleDragStart = (event) => {
 
};
const handleDragEnd = (event) => {
    event.preventDefault(); 

    let elements = document.querySelectorAll(':hover');
    let column;

    console.log(elements);

    for (let i = 0; i < elements.length; i++) {
        console.log(elements[i].dataset.area);
        if (elements[i].dataset.area) {
            column = elements[i].dataset.area;
            break;
        }
    }

    moveToColumn(event.srcElement.dataset.id, column)
};

let isOpen = false
const handleHelpToggle = (event) => {
    isOpen = !isOpen;

    const displayValue = isOpen ? 'block' : 'none';

    document.querySelector('.backdrop').style.display = displayValue;
    html.help.overlay.style.display = displayValue;

    checkOverlayAndFocusBtn(html.help.overlay);
};


const handleAddToggle = (event) => {
    isOpen = !isOpen;

    const displayValue = isOpen ? 'block' : 'none';

    document.querySelector('.backdrop').style.display = displayValue;
    html.add.overlay.style.display = displayValue;

    checkOverlayAndFocusBtn(html.add.overlay);
};


const handleAddSubmit = (event) => {
    event.preventDefault();

    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    
    const element = createOrderHtml(data);

    
    orders.push(element);
    html.columns.ordered.appendChild(element);
    event.target.reset();

    document.querySelector('.backdrop').style.display = 'none'
    html.add.overlay.style.display = 'none'
};


const handleEditToggle = (event) => {
    isOpen = !isOpen

    if (isOpen) {
        document.querySelector('.backdrop').style.display = 'block'
        html.edit.overlay.style.display = 'block'

        const editId = event.srcElement.dataset.id
        const editedObj = orders.find(item => item.dataset.id === editId);
        html.edit.id.dataset.editId = editedObj.dataset.id
        html.edit.title.value = editedObj.querySelector('[data-order-title]').textContent
        html.edit.table.value = editedObj.querySelector('[data-order-table]').textContent
        html.edit.column.value = editedObj.parentNode.dataset.column} 
        else {
        document.querySelector('.backdrop').style.display = 'none'
        html.edit.overlay.style.display = 'none'
    }}

const handleEditSubmit = (event) => {
    event.preventDefault()

    const itemId = html.edit.id.dataset.editId
    const editedObj = orders.find(item => item.dataset.id === itemId)

    const formData = new FormData(event.target)
    formData.set('id', `${itemId}`)
    const data = Object.fromEntries(formData)

    updateEditedItem(editedObj, data);
    moveEditedItemToColumn(data.column, editedObj)
    resetFormAndHideOverlay(html.edit.overlay)
};

const updateEditedItem = (editedObj, data) => {
    ['title', 'table'].forEach(key => {
        const element = editedObj.querySelector(`[data-order-${key}]`)
        if (element) {
            element.textContent = data[key] || ''
        }
    });
};

const moveEditedItemToColumn = (targetColumn, editedObj) => {
    const targetColumnElement = html.columns[targetColumn]
    if (targetColumnElement instanceof HTMLElement) {
        targetColumnElement.appendChild(editedObj)
    }
};

const resetFormAndHideOverlay = (overlay) => {
    event.target.reset();
    hideOverlayAndBackdrop(overlay);
};

const hideOverlayEdit = (overlayElement) => {
    const backdrop = document.querySelector('.backdrop')
    if (backdrop && overlayElement) {
        backdrop.style.display = 'none'
        overlayElement.style.display = 'none'
    }
};


const handleDelete = (event) => {
    const editId = html.edit.id.dataset.editId;

    // Remove item from orders array
    orders = orders.filter(item => item.dataset.id !== editId);

    // Remove corresponding HTML element from the 'ordered' column
    const elementToRemove = document.querySelector(`[data-id="${editId}"]`)
    if (elementToRemove && elementToRemove.parentNode === html.columns.ordered) {
        html.columns.ordered.removeChild(elementToRemove)
    }

    hideOverlayAndBackdrop()
};

const checkOverlayAndFocusBtn = (overlay) => {
    if (overlay.style.display === 'none') {
        html.other.add.focus();
    }
};

const hideOverlayAndBackdrop = () => {
    document.querySelector('.backdrop').style.display = 'none'
    html.edit.overlay.style.display = 'none'

    checkOverlayAndFocusBtn(html.edit.overlay)
};
window.onload = () => html.other.add.focus()

html.add.cancel.addEventListener('click', handleAddToggle)
html.other.add.addEventListener('click', handleAddToggle)
html.add.form.addEventListener('submit', handleAddSubmit)

html.other.grid.addEventListener('click', handleEditToggle)
html.edit.cancel.addEventListener('click', handleEditToggle)
html.edit.form.addEventListener('submit', handleEditSubmit)
html.edit.delete.addEventListener('click', handleDelete)

html.help.cancel.addEventListener('click', handleHelpToggle)
html.other.help.addEventListener('click', handleHelpToggle)

for (const htmlColumn of Object.values(html.columns)) {
    htmlColumn.addEventListener('dragstart', handleDragStart)
    htmlColumn.addEventListener('dragend', handleDragEnd)}
for (const htmlArea of Object.values(html.area)) {
    htmlArea.addEventListener('dragover', handleDragOver)}