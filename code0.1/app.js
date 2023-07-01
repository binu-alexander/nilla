new Vue({
    el: '#app',
    data() {
        return {
            csvInput: '',
            taggedOutput: ''
        };
    },
    methods: {
        importCSV(event) {
            const file = event.target.files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = (e) => {
                    const contents = e.target.result;
                    this.csvInput = contents;
                };

                reader.readAsText(file);
            }
        },
        tagText() {
            const lines = this.csvInput.split('\n');
            let taggedOutput = '';
            let currentBook = '';
            let currentChapter = '';

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line) {
                    const parts = line.split(',');
                    const book = parts[0].trim();
                    const chapter = parts[1].trim();
                    const verse = parts[2].trim();
                    const text = parts[3].trim();

                    if (book !== currentBook || chapter !== currentChapter) {
                        if (taggedOutput) {
                            taggedOutput += '\n\n';
                        }

                        taggedOutput += `\\ide ${book}\n\\c ${chapter}\n`;
                        currentBook = book;
                        currentChapter = chapter;
                    }

                    taggedOutput += `\\v ${verse} ${text}\n`;
                }
            }

            this.taggedOutput = taggedOutput;
        },
        saveOutput() {
            if (!this.taggedOutput) {
                alert('No tagged output to save.');
                return;
            }

            const blob = new Blob([this.taggedOutput], { type: 'text/plain' });
            let fileName = 'output.usfm'; // Default file name

            // Get the book name
            const lines = this.csvInput.split('\n');
            if (lines.length > 0) {
                const parts = lines[0].split(',');
                const book = parts[0].trim();
                if (book) {
                    fileName = `${book}.usfm`; // Use the book name as the file name
                }
            }

            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();

            window.URL.revokeObjectURL(link.href);
        },
        resetText() {
            this.csvInput = '';
            this.taggedOutput = '';

            // Clear file input value
            const fileInput = document.querySelector('input[type="file"]');
            fileInput.value = '';
        }
    },
    mounted() {
        const textFields = document.querySelectorAll('.mdc-text-field');
        for (const textField of textFields) {
            mdc.textField.MDCTextField.attachTo(textField);
        }

        const buttons = document.querySelectorAll('.mdc-button');
        for (const button of buttons) {
            mdc.ripple.MDCRipple.attachTo(button);
        }
    }
});
