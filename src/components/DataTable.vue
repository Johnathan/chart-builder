<template>
    <div class="data-table" @key.up="previousRow">

        <table v-click-outside="clickOut">
            <tr v-for="(row, rowIndex) in internalRows">
                <td v-for="(cellValue, cellIndex) in row">
                    <input
                            type="text"
                            v-model="row[cellIndex]"
                            :class="cellClass(rowIndex, cellIndex)"
                            @click.right="testRightClick"
                            @mousedown.prevent="gotoCell({rowIndex, cellIndex})"
                            @keydown.up.prevent="gotoCell({rowIndex: rowIndex - 1, cellIndex})"
                            @keydown.down.prevent="gotoCell({rowIndex: rowIndex + 1, cellIndex})"
                            @keydown.left.prevent="gotoCell({rowIndex, cellIndex: cellIndex - 1})"
                            @keydown.right.prevent="gotoCell({rowIndex, cellIndex: cellIndex + 1})"
                            :ref="`cell-${rowIndex},${cellIndex}`"
                    >
                </td>
                <td @click="addColumn" v-if="rowIndex === 0">Add Column</td>
            </tr>
            <tr>
                <td @click="addRow">Add Row</td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        props: {
            rows: {
                type: Array,
                default() {
                    return [
                        [null, 'Column 1', 'Column 2'],
                        ['TITLE', 'Cell 1,1', 'Cell 1,2'],
                        ['TITLE2', 'Cell 2,1', 'Cell 2,2'],
                    ];
                },
            },
        },
        data() {
            return {
                contextMenuVisible: true,
                contextMenuPosition: [0,0],
                activeRowIndex: null,
                activeCellIndex: null,
                internalRows: [],
            };
        },

        mounted() {
            this.internalRows = this.rows;
        },

        methods: {
            testRightClick() {
              console.log('right?');
            },
            gotoCell(cell) {
                const {rowIndex, cellIndex} = cell;

                if(typeof this.rows[rowIndex] !== 'undefined' && typeof this.rows[rowIndex][cellIndex] !== 'undefined') {
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

            addRow() {
                this.internalRows.push(this.internalRows[0].map(() => null));
                this.gotoCell({rowIndex: this.activeRowIndex, cellIndex: this.activeCellIndex});
            },

            addColumn() {
                this.internalRows.map((row) => {
                    row.push(null);
                    return row;
                });
                this.gotoCell({rowIndex: this.activeRowIndex, cellIndex: this.activeCellIndex});
            },
        },
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
</style>
