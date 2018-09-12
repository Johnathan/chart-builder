<template>
    <div class="data-table">
        <context-menu ref="cellContextMenu" :menu-items="cellContextMenuItems"></context-menu>

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
            </tr>
        </table>
    </div>
</template>

<script>
    import ContextMenu from './ContextMenu';
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
                        disabled: true,
                        handler: () => console.log('Deleting Row')
                    },
                    {
                        label: 'Delete Column',
                        disabled: true,
                        handler: () => console.log('Deleting Column')
                    },
                    {
                        label: 'Insert Row',
                        children: [
                            {
                                label: 'Insert Before',
                                handler: () => this.addRow(this.activeRowIndex)
                            },
                            {
                                label: 'Insert After',
                                handler: () => this.addRow(this.activeRowIndex + 1)
                            },
                        ]
                    },
                    {
                        label: 'Insert Column',
                        children: [
                            {
                                label: 'Insert Before',
                                handler: () => this.addColumn(this.activeCellIndext)
                            },
                            {
                                label: 'Insert After',
                                handler: () => this.addColumn(this.activeCellIndex + 1)
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
    table {
        border-collapse: collapse;
        border-spacing: 0px;
    }

    td {
        text-align: left;
        cursor: cell;

        input {
            cursor: cell;
        }
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
</style>
