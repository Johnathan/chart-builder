<template>
    <div class="data-table">

        <div class="context-menu context-menu-container" :style="contextMenuStyle" v-click-outside="closeContextMenu" @click="closeContextMenu">
            <ul>
                <li>Delete Row</li>
                <li>Delete Column</li>
                <li>
                    Insert Row
                    <ul class="context-menu">
                        <li @click="addRow(activeRowIndex - 1)">Insert Before</li>
                        <li @click="addRow(activeRowIndex + 1)">Insert After</li>
                    </ul>
                </li>
                <li>
                    Insert Column
                    <ul class="context-menu">
                        <li @click="addColumn(activeCellIndex - 1)">Insert Before</li>
                        <li @click="addColumn(activeCellIndex + 1)">Insert After</li>
                    </ul>
                </li>
            </ul>
        </div>

        <table v-click-outside="clickOut">
            <tr v-for="(row, rowIndex) in internalRows">
                <td v-for="(cellValue, cellIndex) in row">
                    <input
                            type="text"
                            v-model="row[cellIndex]"
                            :class="cellClass(rowIndex, cellIndex)"
                            @click.right.prevent="showContextMenu($event)"
                            @mousedown.prevent="gotoCell({rowIndex, cellIndex})"
                            @keydown.up.prevent="gotoCell({rowIndex: rowIndex - 1, cellIndex})"
                            @keydown.down.prevent="gotoCell({rowIndex: rowIndex + 1, cellIndex})"
                            @keydown.left.prevent="gotoCell({rowIndex, cellIndex: cellIndex - 1})"
                            @keydown.right.prevent="gotoCell({rowIndex, cellIndex: cellIndex + 1})"
                            :ref="`cell-${rowIndex},${cellIndex}`"
                    >
                </td>
                <td @click="addColumn()" v-if="rowIndex === 0"><span class="add-cell">Add Column</span></td>
            </tr>
            <tr>
                <td @click="addRow()"><span class="add-cell">Add Row</span></td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        props: {
            value: {
                type: Array,
                default() {
                    return [
                        [null, null, null],
                        [null, null, null],
                        [null, null, null],
                    ];
                },
            },
        },
        data() {
            return {
                contextMenuStyle: {},
                activeRowIndex: null,
                activeCellIndex: null,
                internalRows: [],
            };
        },

        mounted() {
            this.internalRows = this.value.length ? this.value : [
                [null, null, null],
                [null, null, null],
                [null, null, null],
            ];
        },

        methods: {
            closeContextMenu() {
                this.contextMenuStyle = {
                    display: 'none'
                };
            },

            showContextMenu(event) {
                this.contextMenuStyle = {
                    display: 'block',
                    left: event.pageX + 'px',
                    top: event.pageY + 'px',
                };
            },

            gotoCell(cell) {
                const {rowIndex, cellIndex} = cell;
                if(typeof this.internalRows[rowIndex] !== 'undefined' && typeof this.internalRows[rowIndex][cellIndex] !== 'undefined') {
                    this.activeRowIndex = rowIndex;
                    this.activeCellIndex = cellIndex;

                    this.$refs[`cell-${rowIndex},${cellIndex}`][0].select();
                }
            },

            clickOut() {
                this.activeRowIndex = null;
                this.activeCellIndex = null;
            },

            cellClass(rowIndex, cellIndex) {
                return {
                    'active-cell': (this.activeRowIndex === rowIndex && this.activeCellIndex === cellIndex),
                };
            },

            addRow(atPosition = this.internalRows.length) {
                if(atPosition < 0)
                {
                    atPosition = 0;
                }

                const rowData = this.internalRows[0].map(() => null);
                this.internalRows.splice(atPosition, 0, rowData);
                this.gotoCell({rowIndex: this.activeRowIndex, cellIndex: this.activeCellIndex});
            },

            addColumn(atPosition = this.internalRows[0].length) {
                if(atPosition < 0)
                {
                    atPosition = 0;
                }

                this.internalRows.map((row) => {
                    row.splice(atPosition, 0, null);
                    return row;
                });
                this.gotoCell({rowIndex: this.activeRowIndex, cellIndex: this.activeCellIndex});
            },
        },

        watch: {
            internalRows: {
                deep: true,
                handler() {
                    this.$emit('input', this.internalRows);
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    table {
        border-collapse: collapse;
        border-spacing: 0px;
    }

    td {
        text-align: left;
    }

    .active-cell {
        outline: 3px solid #0d8fff;
    }

    .add-cell {
        background: #d1d1d1;
        color: #0d8fff;
        font-family: sans-serif;
        font-size: 0.8em;
        display: block;
        padding: 0.2em .1em;
        text-align: center;
        cursor: pointer;
    }

    // Context Menu Stuff, should probably move this somewhere else.
    $context-menu-border-radius: 4px;

    .context-menu-container {
        display: none;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: .8em;
        position: absolute;
        user-select: none;
    }

    .context-menu {
        background: #e4e4e4;
        border-radius: $context-menu-border-radius;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);

        ul {
            margin: 0;
            padding: 0;
            list-style: none;

            :first-child {
                border-top-right-radius: $context-menu-border-radius;
                border-top-left-radius: $context-menu-border-radius;
            }

            :last-child {
                border-bottom-right-radius: $context-menu-border-radius;
                border-bottom-left-radius: $context-menu-border-radius;
            }


            li {
                position: relative;
                padding: .5em 1em;
                cursor: pointer;

                ul {
                    display: none;
                }

                &:hover {
                    background: rgba(0,0,0,0.1);
                    > ul {
                        position: absolute;
                        left: 102%;
                        top: 0;
                        display: block;
                        width: 100%;
                    }
                }
            }
        }
    }
</style>
