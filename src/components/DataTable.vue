<template>
    <div class="data-table">
        <context-menu ref="cellContextMenu" :menu-items="cellContextMenuItems"></context-menu>

        <div class="border" :style="borderStyle"></div>
        <table v-click-outside="clickOut">
            <tr v-for="(row, rowIndex) in internalRows">
                <td v-for="(cellValue, cellIndex) in row" :class="`cell-${rowIndex}_${cellIndex}`">
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
                            @keydown.tab.prevent="gotoCell({rowIndex, cellIndex: cellIndex + 1})"
                            @keydown.shift.tab.prevent="gotoCell({rowIndex, cellIndex: cellIndex - 1})"
                            :ref="`cell-${rowIndex},${cellIndex}`"
                    >
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
    import ContextMenu from 'vue-context-menu-popup';
    import 'vue-context-menu-popup/dist/vue-context-menu-popup.css';
    import {ClickOutside} from '../directives/clickOutside';

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
                cellContextMenuItems: [
                    {
                        label: 'Delete Row',
                        handler: () => this.deleteRow(this.activeRowIndex)
                    },
                    {
                        label: 'Delete Column',
                        handler: () => this.deleteColumn(this.activeCellIndex)
                    },
                    {
                        label: 'Insert Row',
                        children: [
                            {
                                label: 'Insert Before',
                                handler: () => this.insertRow(this.activeRowIndex)
                            },
                            {
                                label: 'Insert After',
                                handler: () => this.insertRow(this.activeRowIndex + 1)
                            },
                        ]
                    },
                    {
                        label: 'Insert Column',
                        children: [
                            {
                                label: 'Insert Before',
                                handler: () => this.insertColumn(this.activeCellIndex)
                            },
                            {
                                label: 'Insert After',
                                handler: () => this.insertColumn(this.activeCellIndex + 1)
                            },
                        ]
                    }
                ],
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
            showContextMenu(event) {
                console.log({
                    activeRowIndex: this.activeRowIndex,
                    activeCellIndex: this.activeCellIndex
                });
                this.$refs.cellContextMenu.open(event);
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

            insertRow(atPosition = this.internalRows.length) {
                if(atPosition < 0)
                {
                    atPosition = 0;
                }

                const rowData = this.internalRows[0].map(() => null);
                this.internalRows.splice(atPosition, 0, rowData);
                this.gotoCell({rowIndex: this.activeRowIndex, cellIndex: this.activeCellIndex});
            },

            insertColumn(atPosition = this.internalRows[0].length) {
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

            deleteRow(atPosition) {
                this.internalRows.splice(atPosition, 1);
            },

            deleteColumn(atPosition) {
                this.internalRows.map(row => {
                    row.splice(atPosition, 1);
                });
            }
        },

        computed: {
            borderStyle() {
                    if(this.activeRowIndex !== null && this.activeCellIndex !== null)
                    {
                        const activeCellBoundingRect = this.$el.
                            querySelector(`.cell-${this.activeRowIndex}_${this.activeCellIndex}`)
                            .getBoundingClientRect();

                        return {
                            width: activeCellBoundingRect.width - 1 + 'px',
                            height: activeCellBoundingRect.height - 1 + 'px',
                            left: (activeCellBoundingRect.x - 2) + 'px',
                            top: (activeCellBoundingRect.y - 2) + 'px',
                        }
                    }
                    else
                    {
                        return {
                            display: 'none',
                        }
                    }
            }
        },

        watch: {
            internalRows: {
                deep: true,
                handler() {
                    this.$emit('input', this.internalRows);
                }
            }
        },

        components: {
          'context-menu': ContextMenu
        },

        directives: {
            ClickOutside
        }
    };
</script>

<style scoped lang="scss">
    .border {
        border: 3px solid #0d8fff;
        width: 97%;
        height: 81%;
        position: absolute;
        left: 0;
        top: 0;
    }

    table {
        border-collapse: collapse;
        width: 100%;
    }

    td {
        text-align: left;
        cursor: cell;
        border: 1px solid #e4e4e4;
        padding: 0;

        input {
            cursor: cell;
            border: none;
            outline: none;
            padding: 2px;
            width: calc(100% - 4px);
        }
    }

    .border {
        transition: all;
        transition-duration: 150ms;
        pointer-events: none;
    }
</style>
